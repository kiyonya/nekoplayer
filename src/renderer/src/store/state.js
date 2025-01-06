import { defaultAudioStatus, defaultConfig, defaultEqualizerData, defaultPlayerData } from './default'

export default {
  playerData: JSON.parse(localStorage.getItem('neko_playerData')) || defaultPlayerData,
  equalizerData: JSON.parse(localStorage.getItem('neko_equalizerData')) || defaultEqualizerData,
  config: JSON.parse(localStorage.getItem('neko_config')) || defaultConfig,
  audioStatus:JSON.parse(localStorage.getItem('neko_audioStatus')) || defaultAudioStatus,
  localMusicPath:JSON.parse(localStorage.getItem('neko_localMusicPath')) ,
  musicInfo: {
    id: 0,
    name: '',
    tns: [],
    alia: [],
    cover: '',
    artist: [],
    album: {},
    duration: 0,
    mv: 0
  },
  musicResource: {},





  showPlayer:false,
  showPlaylistBar:false
}
