
import { ref, watch } from 'vue'
const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const musicMeta = require('music-metadata')
const musicExtendName = ['.mp3', '.flac', '.wav']
const localPath = ref(JSON.parse(localStorage.getItem('neko_localMusicPath')) || {})
const localFullPathSet = ref(new Set())
const localCoverCache = ref(JSON.parse(localStorage.getItem("neko_localCoverCache")) || {})
for (let libname in localPath.value) {
  localFullPathSet.value.add(localPath.value[libname].path)
}
const displayFiles = ref([])
const displayDir = ref('')
export { localPath, displayFiles, displayDir, localFullPathSet ,localCoverCache}
export async function openDir() {
  const path = await window.api.openDir()
  return path
}
export async function newDir() {
  const path = await openDir()
  return path
}
export async function createNewLab(name, path) {
  const uuid = crypto.randomUUID()
  localPath.value[name] = {
    name: name,
    path: path,
    uuid: uuid
  }
  localFullPathSet.value.add(path)
  save()
  const setupMeta = {
    info: {
      name: name,
      path: path,
      creator: '',
      cover: '',
      createTime: Date.now(),
      platform: os.platform(),
      meta: 'meta.nkc',
      lyric: 'lyric_cache.nkc',
      version: '0.1',
      uuid: uuid
    }
  }
  writeDirMeta(path, setupMeta)
}
export async function loadPathFiles(dir) {
  displayDir.value = dir
  let data = fileReader(dir)
  for (let file of data) {
    const fullpath = file.path
    const meta = await musicMeta.parseFile(fullpath)
    //console.log(meta)
    ;(file.name = meta.common.title || path.basename(fullpath).replace(file.extname, '')),
      (file.artist = meta.common.artists || []),
      (file.cover = meta.common?.picture ? blobImg(meta.common.picture[0]) : ''),
      (file.bitrate = meta.format.bitrate),
      (file.sampleRate = meta.format.sampleRate),
      (file.album = meta.common.album)
  }
  displayFiles.value = data
}
function save() {
  localStorage.setItem('neko_localMusicPath', JSON.stringify(localPath.value))
}
export function clear() {
  localPath.value = {}
  displayFiles.value = []
  localFullPathSet.value = new Set()
  localStorage.setItem('neko_localMusicPath', JSON.stringify({}))
}
function fileReader(dirPath) {
  const filePaths = []
  let stats = fs.statSync(dirPath)
  if (stats.isFile()) {
    const extname = path.extname(dirPath)
    if (musicExtendName.includes(extname)) {
      filePaths.push({
        path: dirPath,
        name: dirPath,
        extname: path.extname(dirPath)
      })
    }
    return filePaths
  }
  function readDirectory(currentPath) {
    const items = fs.readdirSync(currentPath)

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item)
      const stats = fs.statSync(fullPath)

      if (stats.isDirectory()) {
        // 如果是文件夹，递归读取
        readDirectory(fullPath)
      } else {
        // 如果是文件，判断是不是支持类型
        const extname = path.extname(item)
        if (musicExtendName.includes(extname)) {
          filePaths.push({
            path: fullPath,
            extname: extname,
            dir: dirPath
          })
        }
      }
    })
  }
  readDirectory(dirPath)
  return filePaths
}
export function blobImg(picture) {
  if (!picture) {
    return
  }
  const mime = picture.format
  const blob = new Blob([picture.data], { type: mime })
  const url = URL.createObjectURL(blob)
  return url
}
export function readLocalLyricCache(dir, md5) {
  const cachePath = path.join(dir, 'lyric.cache')
  let isExist = fs.existsSync(cachePath)
  if (isExist) {
    let lyric = fs.readFileSync(cachePath, 'utf-8')
    lyric = JSON.parse(lyric)
    const targetLyricData = lyric[md5]
    if (targetLyricData) {
      return { lyricState: targetLyricData.lyricState, lyric: targetLyricData.lyric }
    } else {
      return false
    }
  } else {
    return false
  }
}
export function writeLocalLyricCache(dir, md5, { lyric, lyricState }) {
  const cachePath = path.join(dir, 'lyric.cache')
  let lyricCache
  let isExist = fs.existsSync(cachePath)
  if (isExist) {
    lyricCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  } else {
    lyricCache = {}
  }
  lyricCache[md5] = { lyric: lyric, lyricState: lyricState }
  fs.writeFileSync(cachePath, JSON.stringify(lyricCache), 'utf-8')
}
export function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath)
    return true
  } catch (error) {
    alert('文件占用无法删除')
  }
}
export function writeDirMeta(dir, meta = {}) {
  const metaPath = path.join(dir, 'meta.nkc')
  fs.writeFileSync(metaPath, JSON.stringify(meta), 'utf-8')
}

export function saveCoverCache(){
  localStorage.setItem("neko_localCoverCache",JSON.stringify(localCoverCache.value))
}
