import { getSongUrl, checkMusicStatus, getSongDetial } from '@/api/song'
import { nekoLyricObjectGenerator } from '@/utils/lrc'
import { store } from '@/store'
import temp from '@/store/temp'
import { computed, watch } from 'vue'
import { getPlaylistDetial } from '@/api/playlist'
import { getAlbum } from '@/api/album'
import { matchSong } from '@/api/edit'
import { fileToMD5 } from '@/utils/enc'
import { readLocalLyricCache, writeLocalLyricCache } from './localMusic'
const musicMeta = require('music-metadata')
const path = require('path')

const config = computed(()=>{
  return store.state.config
})

const musicInfo = computed({
  get: () => store.state.musicInfo,
  set: (val) => store.commit('updateMusicInfo', val)
})
const musicResource = computed({
  get: () => store.state.musicResource,
  set: (val) => store.commit('updateMusicResource', val)
})
const audio = temp.audio
const audioQuality = computed({
  get: () => store.state.config.audioQuality
})
const playlist = computed({
  get: () => store.state.playerData.list,
  set: (val) => store.commit('updatePlayerData', { key: 'list', value: val })
})
const index = computed({
  get: () => store.state.playerData.index,
  set: (val) => store.commit('updatePlayerData', { key: 'index', value: val })
})
const randomIndexHistory = computed({
  get: () => store.state.playerData.randomIndexHistory,
  set: (val) => store.commit('updatePlayerData', { key: 'randomIndexHistory', value: val })
})
const playmode = computed({
  get: () => store.state.playerData.mode,
  set: (val) => store.commit('updatePlayerData', { key: 'mode', value: val })
})
export { playlist, index, randomIndexHistory, playmode }

/**
 * 音频播放函数
 * 格式：{id:,type:,source:,sourceId:,data:,callback:}
 * @param {object} info
 * @param {object}
 */
export async function play(
  { id, type, action, source, sourceId, data, callback },
  autoplay = true,
  replaceResource = true
) {
  //是否替换rs?
  if (musicResource.value.sourceId != sourceId && replaceResource) {
    musicResource.value = { id, action, source, sourceId, data, type }
  }

  if (action !== 'playlocal') {
    //检查音源
    const isCanplay = await checkMusicStatus(id)
    if (!isCanplay) return { msg: '无版权' }

    //获取音频url并载入
    handleAudioLoad(id, autoplay || true)
    await loadMusicInfo(id)
    //获取歌词
    const lyric = await nekoLyricObjectGenerator(id)
    temp.lyric.value = lyric
  } else {
    const songFilePath = id
    const md5 = await fileToMD5(songFilePath)
    handleLocalload(songFilePath, autoplay)
    const localFileInfo = await loadLocalMusicInfo(id,md5)
    console.log(localFileInfo)
    //本地歌曲路径
    let dir = sourceId.split('@')[0]
    let cacheLyric =   config.value.useLocalCacheLyric ? readLocalLyricCache(dir, md5) : undefined
    if (cacheLyric) {
      //允许读取本地缓存的歌词
      temp.lyric.value = cacheLyric.lyric
      temp.lyricStatus.value = {...cacheLyric.lyricState,localcache:true}
    } else if (localFileInfo?.ncmid && config.value.useMatchLocalFileOnNcm) {
      //允许联网匹配才会获取歌词数据并且写入本地
      const lyric = await nekoLyricObjectGenerator(localFileInfo.ncmid)
      console.log('歌词已匹配')
      temp.lyric.value = lyric


      //允许本地缓存后写入io
      if(config.value.useCacheLocalMusicLyric){
        writeLocalLyricCache(dir, md5, {
          lyric: lyric,
          lyricState: temp.lyricStatus.value
        })
      }


    } else {
      console.log('未匹配歌词')
      temp.lyric.value = { 0: { lrc: '本地音乐' } }
      temp.lyricStatus.value = {}
    }
  }
  //定位指针并上传
  index.value = getIndex(id)
  if (playmode.value == 'random' && randomIndexHistory.value.indexOf(index.value) < 0) {
    randomIndexHistory.value.push(index.value)
  }

  if(callback){
    callback(musicInfo.value)
  }
}
const handleLocalload = (file, autoplay) => {
  audio.src = file
  audio.load()
  audio.pause()
  if (autoplay) {
    audio.play()
  }
}
const blobImg = (picture) => {
  if (!picture) {
    return
  }
  const mime = picture.format
  const blob = new Blob([picture.data], { type: mime })
  const url = URL.createObjectURL(blob)
  return url
}
const loadLocalMusicInfo = async (file,md5) => {
  const filename = path.basename(file)
  const meta = await musicMeta.parseFile(file)
  //允许联网匹配才会有match数据
  const match = config.value.useMatchLocalFileOnNcm ? await matchLocalMusic(md5, meta) : undefined
  console.log(match)
  if (match) {
    //仍然保持本地播放和本地属性
    match.ncmid = match.id
    match.id = file
    match.artist = match.artists
    match.ncmmatch = true
    //保持原封面 除非没有
    match.cover = meta.common?.picture ? blobImg(meta.common.picture[0]) : match.album.picUrl
    ;(match.type = 'local'), (match.local = true), (match.format = meta.format),(match.md5 = md5)
    musicInfo.value = match
    return match
  } else {
    const info = {
      id: file,
      name: meta.common.title || filename,
      tns: undefined,
      alia: undefined,
      artist: meta.common?.artists
        ? meta.common.artists.map((ar) => {
            return { id: -1, name: ar }
          })
        : [],
      cover: meta.common?.picture ? blobImg(meta.common.picture[0]) : '',
      duration: audio.duration,
      mv: null,
      expectQuality: 'loacl',
      type: 'local',
      local: true,
      format: meta.format,
      md5:md5
    }
    musicInfo.value = info
    
  }
}
const loadMusicInfo = async (id) => {
  const data = (await getSongDetial(id))?.songs[0]
  const info = {
    id: id,
    name: data.name,
    tns: data.tns || void 0,
    alia: data.alia || void 0,
    cover: data.al.picUrl,
    artist: data.ar,
    album: data.al,
    duration: data.dt,
    mv: data.mv,
    expectQuality: audioQuality.value,
    type: 'net',
    local: false,
    format: {}
  }
  musicInfo.value = info
}
const handleAudioLoad = async (id, autoplay) => {
  const url = await getSongUrl(id, 'lossless')
  audio.src = url
  audio.load()
  audio.pause()
  if (autoplay) {
    audio.play()
  }
}
const handleResourceChange = async ({ id, action, source, sourceId, data }) => {
  const arg = { action, source, sourceId }
  if (action == 'play' && source == 'playlist') {
    const ids = (await getPlaylistDetial(sourceId)).playlist.trackIds
    playlist.value = ids.map((song) => {
      return { id: song.id, ...arg }
    })
  } else if (action == 'play' && source == 'album') {
    const ids = (await getAlbum(sourceId)).songs
    playlist.value = ids.map((song) => {
      return { id: song.id, ...arg }
    })
  } else if (action == 'play' && source == 'dailyrecommend') {
    playlist.value = data.map((song) => {
      return { id: song.id, ...arg }
    })
  } else if (action == 'playlocal' && source == 'local') {
    playlist.value = data.map((localSong) => {
      return { id: localSong.path, ...arg }
    })
  } else if (action == 'addatindex') {
    //添加到歌单 首先看这个歌是不是已经在歌单里了
    const isMusicInPlaylist = locateId(playlist.value, id)
    //如果已经在了 那就什么也不做 因为你已经在了
    //如果不在 那么就把它插入指针位置
    if (isMusicInPlaylist < 0) {
      const tempData = deepClone(playlist.value)
      insert(tempData, { id: id, ...arg }, index.value)
      playlist.value = tempData
    }
  } else if (action == 'addnext') {
    //插入下一首 还是先看在不在歌单 如果在就返回位置 不在就是-1
    const isMusicInPlaylist = locateId(playlist.value, id)
    //如果在 ，将他移动到下一首的位置
    //进行一个深拷贝 保存数据 避免频繁修改
    const tempData = deepClone(playlist.value)
    if (isMusicInPlaylist >= 0) {
      move(
        tempData,
        isMusicInPlaylist,
        index.value >= isMusicInPlaylist ? index.value : index.value + 1
      )
    }
    //如果不在,那就插入下一个的位置
    else {
      insert(tempData, { id: id, ...arg }, index.value)
    }
    playlist.value = tempData
  }
  index.value = getIndex(id)
}

//当资源类型改变的时候 就要重新制作歌单
watch(musicResource, (newVal, oblVal) => {
  if (newVal.sourceId !== oblVal.sourceId) {
    //清空随机指针
    if (!['addatindex'].includes(newVal.action)) {
      randomIndexHistory.value = []
    }
    //这一步必然会带来歌单的变化
    handleResourceChange(newVal)
    //定位指针并上传
  }
})

const getIndex = (id) => {
  if (playlist.value.length <= 0) {
    return 0
  }
  let i = 0
  for (let song of playlist.value) {
    if (song.id == id) {
      break
    } else {
      i++
    }
  }
  return i
}
const locateId = (array, id) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i
    }
  }
  return -1
}
const insert = (arr, data, index) => {
  if (index < 0 || index > arr.length) {
    return
  }
  arr.splice(index + 1, 0, data)
  arr = [...new Set(arr)]
}
const move = (array, from, to) => {
  array.splice(to, 0, array.splice(from, 1)[0])
}
const deepClone = (data) => {
  return JSON.parse(JSON.stringify(data))
}

async function matchLocalMusic(md5, meta) {
  if (meta.common.title && meta.common.artist) {
    const matchData = await matchSong({
      title: meta.common.title,
      album: meta.common.album,
      artist: meta.common.artist,
      duration: meta.format.duration,
      md5: md5
    })
    if (matchData.result.songs.length >= 0) {
      return matchData.result.songs[0]
    } else {
      return false
    }
  }
  return false
}
