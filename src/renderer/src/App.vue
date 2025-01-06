<template>
  <div>
    <div class="eletron-window"></div>
    
    <TopBar v-show="$route.name !== 'DesktopLyric'"></TopBar>
    <LoginWindow v-if="false"></LoginWindow>

    
    <NormalPlaybar v-show=" ![ 'DesktopLyric','MV'].includes($route.name) && store.state.musicInfo.id"></NormalPlaybar>

    <router-view v-slot="{ Component }" @scroll="_scroll($event)" ref="routerView">
      <Transition name="viewer-change">
        <KeepAlive :max="3" :include="['Recommend','LocalMusic']">
          <component :is="Component" class="router-view" :key="$route.fullPath" />
        </KeepAlive>
      </Transition>
    </router-view>

    

    
    <Transition name="fade">
      <PlaylistBar v-if="store.state.showPlaylistBar"></PlaylistBar>
    </Transition>
    <!--
    <Equalizer v-show="store.state.showEqulizerWindow"></Equalizer>
    -->
    <Transition name="player">
    <MusicPlayer v-if="store.state.showPlayer"></MusicPlayer>
    </Transition>
    <button class="totop" :class="showToTop ? 'show-totop' : ''" @click="totop">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
        class="fa"
      >
        <path
          d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19m9-12.243L19.092 17H4.908z"
        />
      </svg>
    </button>
  </div>
</template>
<script setup>
import PlaylistBar from './components/PlaylistBar.vue'
import { getLoginStatus } from './api/login'
import NormalPlaybar from './components/NormalPlaybar.vue'
import LoginWindow from './components/LoginWindow.vue'
import TopBar from './components/TopBar.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import { login } from './lib/auth'
import { computed, ref, watch } from 'vue'
import '@/assets/color.css'
//import Equalizer from './components/Equalizer.vue'
import { store } from './store'
//import storage from './storage'
import temp from './store/temp'
import 'vue-slider-component/theme/default.css'



//是否显示登录
login()
//检查登录状态

window.oncontextmenu = (e) => {
  e.preventDefault()
}

const showToTop = ref(false)
function _scroll(e) {
  if (e.target.scrollTop > window.innerHeight) {
    showToTop.value = true
  } else {
    showToTop.value = false
  }
}
function totop() {
  document.querySelector('.router-view').scrollTo({ top: 0, behavior: 'smooth' })
}

//设置默认字体
const body = document.body
const font = computed(() => {
  return store.state.appFont
})
watch(
  font,
  () => {
    console.log(font.value)

    let fontimport = document.querySelector('.font-face')
    if (!fontimport) {
      const style = document.createElement('style')
      style.classList.add('font-face')
      document.head.appendChild(style)
      fontimport = style
    }

    fontimport.innerHTML = `
  @font-face {
    font-family: "app-font";
    src: local("${font.value}");
  }`
  },
  { immediate: true }
)
</script>
<style>
.router-view {
  --w: 95%;
  width: var(--w);
  padding-left: calc((100% - var(--w)) / 2);
  padding-right: calc((100% - var(--w)) / 2);
  height: calc(100% - 3.75rem - 4rem);
  position: absolute;
  top: 3.75rem;
  left: 0;
  overflow-y: scroll;
}

@keyframes viewer-in {
  from {
    opacity: 0;
  }
}

.player {
  transform: translateY(100vh);
  visibility: hidden;
  transition: 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.showplayer {
  visibility: visible;
  transform: none;
}

.totop {
  width: 3rem;
  height: 3rem;
  background: var(--app-theme-component-op);
  backdrop-filter: blur(3px);
  position: fixed;
  right: 1.5rem;
  bottom: 6rem;
  animation: totop 0.6s ease-in-out;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(10rem);
  transition: 0.3s ease-in-out;
  opacity: 0;
}
.show-totop {
  transform: none;
  opacity: 1;
}

.viewer-change-enter-active {
  
}

.viewer-change-leave-active {
  
}
.fade-enter-active,
.fade-leave-active,
.fade-enter,
.fade-leave-to {

  transform: translateX(27vw);
}
.player-enter,
.player-leave-to {
  transition: .5s cubic-bezier(0.075, 0.82, 0.165, 1);
  transform: translateY(100vh);
}
</style>
