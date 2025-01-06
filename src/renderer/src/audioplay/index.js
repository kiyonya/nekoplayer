import temp from '@/store/temp'
import { initAudioCtx } from './audio-effect'
import { store } from '@/store'
import { computed, watch } from 'vue'
import { playmode } from './player'
import { next } from './audio-control'
import { send } from '@/lib/msgSender'
import { initDesktopLyricApi } from './desktop'



const audio = temp.audio
export function initAudio() {
  //监听音频播放，创建音频上下文
  audio.addEventListener('play', initAudioCtx(audio))
  //创建音频监听器
  handleAudioListener()
  //
  initDesktopLyricApi()
}
const handleAudioListener = ()=>{
  audio.addEventListener("timeupdate",()=>{_update("currentTime",audio.currentTime || 0)})
  audio.addEventListener('canplay',()=>{_update("duration",audio.duration || 0)})
  audio.addEventListener("pause",()=>{_update("status","pause")})
  audio.addEventListener("play",()=>{_update("status","pause")})
  audio.addEventListener("volumechange",()=>{_update("volume",audio.volume)})
  function _update(key,value){
    store.commit("updateAudioStatus",{key:key,value:value})
  }
}

//音频结束时的操作
audio.addEventListener('ended',()=>{
  if(playmode.value !== "loop"){next()}
  else{
    audio.currentTime = 0
    audio.play()
  }
})

audio.ontimeupdate = ()=>{
  send("audioStatus",{currentTime:audio.currentTime,duration:audio.duration})
}