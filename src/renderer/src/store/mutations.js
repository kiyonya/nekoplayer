export default {
  updatePlayerData(state, { key, value }) {
    state.playerData[key] = value
  },
  updateMusicInfo(state,value){
    state.musicInfo = value
  },
  updateMusicResource(state,value){
    state.musicResource = value
  },
  updateAudioStatus(state,{key,value}){
    state.audioStatus[key] = value
  },

  showPlayer(state,value){
    state.showPlayer = value
  },
  showPlaylistBar(state,value){
    state.showPlaylistBar = value
  },
  updateLocalMusicPath(state,value){
    state.localMusicPath = value  
  }
}
