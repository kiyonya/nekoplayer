import { handleHighlight } from "@/musicplayer/lyric"
import temp from "@/store/temp"
import { next, previous, togglePlay } from "./audio-control"
const lyric = temp.lyric || {}
const audio = temp.audio
const channel = new BroadcastChannel('desktoplyric')
let f = 0
export function initDesktopLyricApi() {
  
  channel.onmessage = (e) => {
    handleChannelMsg(e.data)
  }
}
function getHighlightLyric(){
    let index =handleHighlight(lyric,audio.currentTime,f)
    let currentLyric = lyric.value[Object.keys(lyric.value)[index]]
    channel.postMessage(JSON.stringify({key:"lyric",value:currentLyric}))
}
function postAudioStatus(){
    console.log("发送")
    channel.postMessage(JSON.stringify({key:"audioStatus",value:!audio.paused}))
}
function handleChannelMsg(data){
    if(data == "mounted"){
        postAudioStatus()
        audio.addEventListener("timeupdate",getHighlightLyric)
        audio.addEventListener("playing",postAudioStatus)
        audio.addEventListener('pause',postAudioStatus)
        
    }
    else if(data == "play&pause"){
        togglePlay()
    }
    else if(data == "next"){
        next()
    }
    else if(data == "previous"){
        previous()
    }
    else if(data == "f5"){
        f += 0.5
        channel.postMessage(JSON.stringify({key:"offset",value:f}))
    }
    else if(data == "b5"){
        f -= 0.5
        channel.postMessage(JSON.stringify({key:"offset",value:f}))
    }
}