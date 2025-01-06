<template>
  <div class="page">
    <div class="side-bar">
      <div class="path-shell">
        <div class="no-path" v-if="Object.keys(localPath).length <= 0">
          <Icon icon="mage:box-3d-cross" class="icon3" />
          您还没有导入的目录
        </div>
        <div
          class="path"
          v-for="(key, value) in localPath"
          v-if="localPath"
          @click.stop="loadPathFiles(key?.path)"
          :class="displayDir == key?.path ? 'highlight' : ''"
        >
          <Icon icon="mdi:folder-music-outline" class="icon2" />
          <h3 class="path-name text-limit">{{ key?.name }}</h3>
          <Icon icon="material-symbols:edit-square-outline" class="icon1" />
        </div>
      </div>

      <div class="bottom" @click="showNewWindow = true">
        <Icon icon="mdi:import" class="icon3" />
        <span>导入音频目录</span>
      </div>
    </div>
    <span class="bar">
      <span>当前目录</span>
      <span class="dir" @click.stop="openPath(displayDir)" title="打开目录">{{ displayDir }}</span>
      <span class="count">{{ displayFiles.length }}首音乐</span>

      <button title="刷新目录" @click="loadPathFiles(displayDir)">
        <Icon icon="mdi:refresh" class="icon2" />
      </button>
    </span>
    <KeepAlive max="5">
      <div class="tracks g-shell-5" v-if="displayFiles">
        <MusicCard
          v-for="file in displayFiles"
          :name="file.name"
          :cover="file.cover"
          :path="file.path"
          :key="file.path"
          :br="file.bitrate"
          :ext="file.extname"
          :dir="file.dir"
          :artist="file.artist"
          :album="file.album"
          :sampleRate="file.sampleRate"
          :md5="file.md5"
          @deleteFile="deleteMusic"
        >
        </MusicCard>
        <div class="empty" v-if="displayFiles.length == 0">
          <Icon icon="mage:box-3d-cross" class="icon3" />
          <span>这里什么也没有</span>
        </div>
      </div>
    </KeepAlive>
    <ModalWindow v-if="showNewWindow" @close="showNewWindow = false">
      <h1>新建本地音乐库</h1>
      <span>请输入音乐库名</span>
      <input type="text" name="" id="" class="lab-name" v-model="labName" />
      <br />
      <div class="row">
        <button class="strong-button" @click.stop="newLocalLab">选择文件夹</button>
        <span>{{ selectedPath }}</span>
      </div>
      <span v-if="localPath[labName] || localFullPathSet.has(selectedPath)">该名称或者目录已存在</span>
      <div class="row self-bottom to-right">
        <button class="strong-button" @click="createLab()" :disabled="localPath[labName] || localFullPathSet.has(selectedPath)">创建</button>
        <button @click="showNewWindow = false">取消</button>
      </div>
    </ModalWindow>

    <ModalWindow v-if="false">
      <h1>编辑目录</h1>
      <span>编辑名称</span>
      <input type="text" class="lab-name" />
      <div class="row">
        <button class="color-button" @click.stop="">选择文件夹</button>
        <span>{{ selectedPath }}</span>
      </div>
      <div class="row self-bottom to-right">
        <button class="color-button" @click="">创建</button>
        <button class="n-button" @click="showNewWindow = false">取消</button>
      </div>
    </ModalWindow>

    <button @click="clear">清理一下</button>
  </div>
</template>
<script setup>
import {
  newDir,
  createNewLab,
  localPath,
  clear,
  displayFiles,
  loadPathFiles,
  displayDir,
  deleteFile,
  localFullPathSet
} from '@/audioplay/localMusic'
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import MusicCard from '@/components/MusicCard.vue'
import ModalWindow from '@/components/windows/ModalWindow.vue'
import { openPath } from '@/main'
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue'
const selectedPath = ref('')
const labName = ref('')
const showNewWindow = ref(false)
async function newLocalLab() {
  const path = await newDir()
  selectedPath.value = path
}
function createLab() {
  if (!selectedPath.value || !labName.value) {
    return
  }
  createNewLab(labName.value, selectedPath.value)
  displayDir.value = selectedPath.value
  loadPathFiles(displayDir.value)
  showNewWindow.value = false
  labName.value = ''
  selectedPath.value = ''
}
function deleteMusic(filepath) {
  let res = deleteFile(filepath)
  if (res) {
    removeFromDir(filepath)
  }
}
function removeFromDir(filepath) {
  for (let i = 0; i < displayFiles.value.length; i++) {
    if (displayFiles.value[i].path == filepath) {
      console.log('删除')
      displayFiles.value.splice(i, 1)
      break
    }
  }
}
onMounted(() => {
  if (Object.keys(localPath.value).length > 0) {
    loadPathFiles(localPath.value[Object.keys(localPath.value)[0]].path)
  }
})
</script>
<style scoped>
.page {
  background: #fafcff;
}
.side-bar {
  position: fixed;
  width: calc(17vw);
  height: calc(100vh - 4rem - 4rem - 4rem);
  background-color: rgb(255, 255, 255);
  left: 0;
  top: 4rem;
  bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}
.path-shell {
  width: 90%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow-y: auto;
}
.path {
  width: calc(100% - 1rem);
  padding: 0rem 0.5rem;
  height: auto;
  min-height: 3rem;
  color: var(--text-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  opacity: var(--text-opacity-2);
}
.path:hover {
  background: var(--hover);
}
.path .path-name {
  font-size: 1.1rem;
  flex: 1;
}
.path .path-track-count {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: var(--text-opacity-3);
}
.bottom {
  margin-top: auto;
  margin-bottom: 0;
  width: calc(90% - 1rem);
  height: fit-content;
  color: var(--text-color);
  border-radius: 0.2rem;
  padding: 0.2rem 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  opacity: var(--text-opacity-2);
}
.bottom:hover {
  background: var(--hover);
}
.tracks {
  width: calc(100% - 17vw);
  height: fit-content;
  margin: 1rem 0 0 auto;
  position: relative;
}

.icon1 {
  width: 1.2em;
  height: 1.2em;
  opacity: 0.7;
  color: inherit;
}
.icon2 {
  width: 1.5em;
  height: 1.5em;
  color: inherit;
}
.icon3 {
  width: 2em;
  height: 2em;
  color: inherit;
}

.lab-name {
  width: calc(100% - 2rem);
  height: 2.2rem;
  font-size: 1.2rem;
  font-weight: 600;
  outline: none;
  padding: 0 1rem;
  border: none;
  background: var(--hover);
  border-radius: 0.2rem;
}
.lab-name:focus {
  outline: var(--app-theme-strong-background) 2px solid;
}
.highlight {
  background: var(--app-theme-strong-background) !important;
  color: #ffffff !important;
  pointer-events: none;
  opacity: 1;
}
.highlight * {
  opacity: 1 !important;
}
.no-path {
  width: 90%;
  height: 6rem;
  top: calc(50% - 3rem);
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.2rem;
  opacity: 0.5;
}
hr {
  margin: 0.5rem 0 0.5rem 0;
  background: var(--border);
  opacity: 0.5;
}
.bar {
  width: calc(100% - 17vw - 2rem);
  height: 3rem;
  margin: 3rem 0 0 auto;
  background-color: aquamarine;
  background: var(--component);
  box-shadow: var(--component-shadow) 0 1px 5px;
  border-radius: var(--br-1);
  display: flex;
  flex-direction: row;
  padding: 0 1rem;
  align-content: center;
  align-items: center;
  gap: 1rem;
}
.bar span {
  font-weight: 600;
  font-size: 1rem;
  opacity: var(--text-opacity-2);
}
.bar .dir:hover {
  text-decoration: underline;
}
.bar .icon2 {
  margin-left: auto;
  margin-right: 0;
  transition: 0.2s;
  opacity: var(--text-opacity-2);
}
.bar .icon2:active {
  transform: scale(0.9);
}
.empty {
  position: absolute;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 10rem;
  top: 14rem;
  font-size: 1.4rem;
  font-weight: 600;
  opacity: 0.3;
  gap: 1rem;
  z-index: 0;
}
.empty .icon3 {
  width: 6rem;
  height: 6rem;
}
</style>
