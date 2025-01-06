<template>
  <div class="music-player">
    <div class="top-control">
      <button @click.stop="store.commit('showPlayer', false)">
        <Icon icon="mingcute:down-line" class="icon3" />
      </button>
    </div>

    <div class="background">
      <img :src="resize(musicInfo.cover, 1500)" alt="" class="image-background" v-if="false" />
      <div class="dynamic-background">
        <img :src="resize(musicInfo.cover, 500)" alt="" class="color-background" />
        <canvas ref="dynamic" width="500" height="500" class="dynamic-cvs"></canvas>
      </div>
    </div>

    <div class="left">
      <div class="music-info">
        <div class="content">
          <h2 class="name text-limit">{{ musicInfo.name }}</h2>
          <ArtistNameGroup :array="musicInfo.artist" class="artist"></ArtistNameGroup>
        </div>
        <div class="like">
          <button>
            <Icon icon="weui:like-filled" class="icon2" />
            <Icon icon="weui:like-outlined" class="icon2" v-if="false" />
          </button>
          <button><Icon icon="mi:add" class="icon2" /></button>
        </div>
      </div>

      <div class="cover">
        <img
          :src="resize(musicInfo.cover, 800)"
          alt=""
          class="main-cover"
          ref="mainCover"
          crossorigin="anonymous"
        />
        <img
          :src="resize(musicInfo.cover, 400)"
          alt=""
          class="blur-cover"
          crossorigin="anonymous"
        />
      </div>

      <div class="audio-progress">
        <div class="progress">
          <VueSlider
            :interval="0.01"
            :height="4"
            :min="0"
            :max="1"
            v-model="progress"
            :lazy="true"
            @change="(value, index) => (audio.currentTime = value * audioStatus.duration)"
            :tooltip="'none'"
            class="slider"
            :process-style="{ background: '#fff' }"
            :rail-style="{ background: '#ffffff60' }"
            :useKeyboard="true"
            :marks="chrous.map(i=>{return (i / audioStatus.duration).toFixed(5)})"
            
            :hide-label="true"
          ></VueSlider>
        </div>

        <div class="audio-time">
          <span class="time">{{ s2mmss(audioStatus.currentTime) }}</span>
          <span class="time">{{ s2mmss(audioStatus.duration) }}</span>
        </div>
      </div>

      <div class="control">
        <div class="audio-control">
          <button @click.stop="changePlaymode()">
            <Icon icon="tabler:repeat" class="icon1" v-show="playmode == 'list'" />
            <Icon icon="tabler:repeat-once" class="icon1" v-show="playmode == 'loop'" />
            <Icon icon="fe:random" class="icon1" v-show="playmode == 'random'" />
          </button>

          <button @click.stop="previous()">
            <Icon icon="fluent:previous-20-filled" class="icon2" />
          </button>

          <button @click.stop="togglePlay()">
            <Icon icon="fluent:play-12-filled" class="icon3" v-if="audio.paused" />
            <Icon icon="fluent:pause-12-filled" class="icon3" v-if="!audio.paused" />
          </button>

          <button @click.stop="next()">
            <Icon icon="fluent:next-20-filled" class="icon2" />
          </button>

          <!--            <Icon icon="mdi:volume-medium" class="icon1" />
            <Icon icon="mdi:volume-source" class="icon1"  />-->
          <button @click.stop="togglePlaylisyBar()">
            <Icon icon="heroicons:list-bullet-16-solid" class="icon1" />
          </button>
        </div>
      </div>

      <div class="functions">
        <button @click="useDesktopLyric()"><Icon icon="hugeicons:share-04" class="icon2" /></button>
        <button><Icon icon="proicons:timer" class="icon2" /></button>
        <button><Icon icon="fluent:device-eq-20-filled" class="icon2" /></button>
        <button><Icon icon="tdesign:ellipsis" class="icon2" /></button>

        <div class="volume">
          <button><Icon icon="mdi:volume-medium" class="icon2" /></button>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="lyric" ref="lyricContainer">
        <div class="lyric-cell" v-for="(key, value, index) in lyric">
          <p class="lrc">{{ key.lrc || '' }}</p>
          <p v-if="key.tlyric" class="tns" v-show="lyricMode == 'tlyric'">{{ key.tlyric || '' }}</p>
          <p v-if="key.romalrc" class="roma" v-show="lyricMode == 'romalrc'">
            {{ key.romalrc || '' }}
          </p>
        </div>
      </div>

      <div class="lyric-setting">
        <button @click="changeLyric()" class="lyric-mode">
          <span v-if="lyricMode == 'lrc'">词</span>
          <span v-if="lyricMode == 'romalrc'">音</span>
          <span v-if="lyricMode == 'tlyric'">译</span>
        </button>
        <span v-if="temp.lyricStatus.value.localcache">本地缓存</span>
      </div>
    </div>

    <!--交融滤镜-->
    <svg style="display: none">
      <defs>
        <filter id="mix">
          <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur"></feGaussianBlur>
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10"
          ></feColorMatrix>
        </filter>
      </defs>
    </svg>

    <!--右键菜单-->
    <ContextMenu
      :menu="[
        { label: audio.paused ? '播放' : '暂停', act: 'play' },
        { label: '上一首', act: 'previous' },
        { label: '下一首', act: 'next' },
        { label: '分享' },
        { label: '均衡器' },
        { label: '定时播放' },
        { label: '下载' },
        { label: '详情', act: 'detial' }
      ]"
      @select="(e) => handleContextMenu(e)"
    >
    </ContextMenu>

    <ModalWindow v-if="showModalWindow" @close="showModalWindow = false">
      <h1>歌曲信息</h1>
      <span>名称：{{ musicInfo.name }}</span>
      <RouterLink
        v-if="!musicInfo.local || musicInfo.ncmmatch"
        :to="{ name: 'Album', params: { id: musicInfo.album.id } }"
        >专辑：{{
          musicInfo.album.name + (musicInfo.album.tns ? `  (${musicInfo.album.tns[0]})` : '')
        }}</RouterLink
      >
      <span v-if="!musicInfo.local">id：{{ musicInfo.id }}</span>
      <span v-if="musicInfo.local && !musicInfo.ncmmatch"
        >专辑：{{ musicInfo.album || '未知' }}</span
      >
      <span>歌手：<ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup></span>
      <span>时长：{{ s2mmss(audioStatus.duration) }}</span>
      <span v-if="musicInfo.local">地址：{{ musicInfo.id }}</span>
      <span v-if="musicInfo.local"
        >类型：本地<span v-if="musicInfo.ncmmatch">(已匹配网易云)</span></span
      >
      <span v-if="musicInfo.local">比特率：{{ musicInfo.format.bitrate / 1000 }}kbps</span>
      <span v-if="musicInfo.local">采样率：{{ musicInfo.format.sampleRate }}Hz</span>
      <span v-if="musicInfo.local">编码：{{ musicInfo.format.codec }}</span>
      <span v-if="musicInfo.local">容器：{{ musicInfo.format.container }}</span>
      <span v-if="musicInfo.local">码率控制：{{ musicInfo.format.codecProfile }}</span>
    </ModalWindow>
  </div>
</template>
<script setup>
import { store } from '@/store'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { resize } from '@/utils/imageProcess'
import ArtistNameGroup from './ArtistNameGroup.vue'
import ContextMenu from './ContextMenu/ContextMenu.vue'
import VueSlider from 'vue-slider-component'
import { Icon } from '@iconify/vue'
import { next, previous, togglePlay, changePlaymode } from '@/audioplay/audio-control'
import Slider from './Slider.vue'
import temp from '@/store/temp'
import { s2mmss } from '@/utils/libs'
import { chrous, useMusicPlayer } from '@/musicplayer'
import { ref } from 'vue'
import { lyricArea, lyricIndex, changeLyric } from '@/musicplayer/lyric'
import ModalWindow from './windows/ModalWindow.vue'
const showModalWindow = ref(false)
const progress = ref(0)
const audio = temp.audio
const musicInfo = computed({
  get: () => store.state.musicInfo
})
const playmode = computed({
  get: () => store.state.playerData.mode
})
const audioStatus = computed({
  get: () => store.state.audioStatus
})
const lyricMode = computed(() => {
  return lyricArea.value[lyricIndex.value]
})
const showPlaylistBar = computed(() => {
  return store.state.showPlaylistBar
})
const lyric = temp.lyric
const lyricContainer = ref(null)
const mainCover = ref(null)
const dynamic = ref(null)
useMusicPlayer({ lyricContainer: lyricContainer, lyric: lyric, cover: mainCover, dynamic: dynamic })

const handleProgress = () => {
  progress.value = audio.currentTime / audio.duration || 0
}
onMounted(() => {
  audio.addEventListener('timeupdate', handleProgress)
})
onBeforeUnmount(() => {
  audio.removeEventListener('timeupdate', handleProgress)
})

function handleContextMenu(e) {
  if (e.act == 'play') {
    togglePlay()
  } else if (e.act == 'previous') {
    previous()
  } else if (e.act == 'next') {
    next()
  } else if (e.act == 'detial') {
    showModalWindow.value = true
  }
}
function togglePlaylisyBar() {
  if (showPlaylistBar.value) {
    store.commit('showPlaylistBar', false)
  } else {
    store.commit('showPlaylistBar', true)
  }
}

function useDesktopLyric() {
  window.electron.ipcRenderer.send('useDesktopLyric')
}
</script>
<style scoped>
@media screen and (min-width: 1600px) {
  .left {
    width: 32rem !important;
    gap: 3rem !important;
  }
  .music-player {
    --edge-gap: 12% !important;
  }
  .audio-control {
    margin-top: -2rem !important;
  }
}
.music-player {
  --edge-gap: 11%;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9900;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.top-control {
  width: fit-content;
  height: fit-content;
  position: absolute;
  left: 3rem;
  top: 3rem;
  z-index: 3;
}
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  overflow: hidden;

  background: #1d1d1d;
}

.background .image-background {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  filter: blur(20px) brightness(0.65) saturate(1.2);
  transform: scale(1.1);
}

.left {
  width: 28rem;
  height: 85%;
  position: relative;
  margin-left: var(--edge-gap);
  display: flex;
  gap: 1.2rem;
  flex-direction: column;
  justify-content: space-around;
}

.left .music-info {
  display: flex;
  flex-direction: row;
}
.left .music-info .content {
  display: flex;
  flex-direction: column;
  color: #fff;
}
.left .music-info .content .name {
  font-size: 1.8rem;
  max-width: 20rem;
}
.left .music-info .content .artist {
  font-size: 0.9rem;
  opacity: 0.7;
}
.left .music-info .like {
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  height: fit-content;
  width: fit-content;
  margin: auto 0.5rem auto auto;
}
.left .music-info .like .icon2 {
  width: 1.5rem;
  height: 1.5rem;
}

.left .cover {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.left .cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.7rem;
  position: absolute;
  z-index: 1;
  box-shadow: 2px 2px 15px #00000018;
  transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.left .cover .blur-cover {
  z-index: 0;
  width: 100%;
  filter: brightness(0.8) blur(20px) brightness(1.2);
  transform: scale(1.1);
  opacity: 0.3;
}
.left .control {
  display: flex;
  height: fit-content;
  flex-direction: column;
}
.left .control .audio-control {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.9rem;
  align-items: center;
  margin-top: -1rem !important;
}
.left .audio-progress {
  display: flex;
  flex-direction: column;
  height: fit-content;
  gap: 0.5rem;
  color: #fff;
  position: relative;
  z-index: 2;
  margin-top: 0.9rem;
}
.left .audio-progress .time {
  opacity: 0.7;
  font-size: 0.9rem;
}
.left .audio-progress .audio-time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.left .progress {
  width: 100%;
  height: 6px;
  position: relative;
  margin-bottom: 0.8rem;
}
.left .functions {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.left .functions button {
  opacity: 0.75;
}
.functions .volume {
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
.functions .volume .volume-slider {
  width: 100%;
  height: 4px;
  position: relative;
  --b: #ffffff16;
  --l: #fff;
  --r: #ffffff;
}
.right {
  width: 36%;
  height: 84%;
  margin: auto var(--edge-gap) auto var(--edge-gap);
  position: relative;
}
.right .lyric {
  width: 100%;
  height: 96%;
  overflow-x: hidden;
  overflow-y: auto;
  color: #fff;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  mask: linear-gradient(transparent 0%, #000 20%, #000 70%, transparent);
}
.right .lyric .lyric-cell {
  --glow: #ffffff77;
  width: fit-content;
  height: fit-content;
  padding: 0.8rem;
  border-radius: 0.4rem;
  opacity: 0.5;
  filter: blur(1.5px);
  transition: 0.5s ease-in-out;
}
.lyric-cell:first-child {
  margin-top: 50%;
}
.lyric-cell:last-child {
  margin-bottom: 50%;
}
.lyric-cell .lrc {
  font-size: 28px;

  transition: 0.4s ease-in-out;
  transform-origin: left;
}
.lyric-cell .tns,
.roma {
  font-size: 20px;
  font-weight: 600;
  transition: 0.2s ease-in-out;
}
.highlight {
  opacity: 1 !important;
  filter: none !important;

  .lrc {
    font-size: 30px;
    text-shadow:
      0 0 10px var(--glow),
      0 0 20px var(--glow);
  }
  .tns {
    text-shadow:
      0 0 10px var(--glow),
      0 0 20px var(--glow);
  }
  .roma {
    text-shadow:
      0 0 10px var(--glow),
      0 0 20px var(--glow);
  }
}
.right .lyric::-webkit-scrollbar {
  display: none;
}

.right .lyric-setting {
  width: 100%;
  height: 4%;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  color: #fff;
}
.right .lyric-setting .lyric-mode {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.7;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.3rem;
  border: 1px solid #ffffffa6;
}

.dynamic-background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  transform: scale(1.1);
}
.dynamic-background .color-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  opacity: 0.5;
  filter: blur(80px) saturate(1.5) contrast(1.1) brightness(1.1);
  z-index: -1;
}
.dynamic-cvs {
  width: 100%;
  height: 100%;
  filter: url(#mix) blur(500px) saturate(2) brightness(0.8);
  position: absolute;
  z-index: 2;
  opacity: 1;
  /**blur(500px) saturate(1.2) */
}

button {
  width: fit-content;
  height: fit-content;
  aspect-ratio: 1/1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.2rem;

  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: 0.2s;

  color: #ffffff;
}
button:hover {
  background: #ffffff1e;
}
.icon1 {
  width: 1.5em;
  height: 1.5em;
  color: #fff;
  opacity: 0.7;
}
.icon2 {
  width: 2em;
  height: 2em;
  color: #fff;
}
.icon3 {
  width: 3.2em;
  height: 3.2em;
  color: #fff;
}

.change-disc {
  transform: scale(0.9);
}
.slider .vue-slider-mark-step{
  background-color: #fff !important;
}
</style>
