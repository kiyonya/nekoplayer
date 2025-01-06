<template>
  <div class="playlist-obj" :class="true ? '' : 'warp'">
    <h2 class="ti">正在播放</h2>
    <div class="shell">
      <div class="song" style="background: var(--app-theme-strong-background); color: #fff">
        <div class="cover-shell">
          <img :src="resize(musicInfo.cover)" alt="" class="cover" :key="musicInfo.cover"/>
        </div>
        <div class="info">
          <h3 class="text-limit">{{ musicInfo.name }}</h3>
          <ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup>
        </div>
      </div>
    </div>
    <h2 class="ti">播放列表</h2>
    <div class="tracks" ref="tracks">
      <PlaylistBarSong  v-for="song in (display || [])" :song="song"></PlaylistBarSong>
    </div>
  </div>
</template>
<script>
import PlaylistBarSong from './PlaylistBarSong.vue'
import { getSongDetial_Array } from '@/api/artist'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { watch } from 'vue'
import { mapState } from 'vuex'
import { resize } from '@/utils/imageProcess'
import { play } from '@/audioplay/player'
import { playlist } from '@/audioplay/player'
export default {
  computed: {
    ...mapState(['musicInfo'])
  },
  components: {
    PlaylistBarSong,
    ArtistNameGroup
  },
  data() {
    return {
      display: [],
      more: true,
    }
  },
  methods: {
    async loadPlaylistSongs(limit = 100, page = 1) {
      let start = (page - 1) * limit || 0
      let frame = playlist.value.slice(start, page * limit)
      let ids = frame.map((i) => {
        return i.id
      })
      if(!ids.length){return}
      const data = (await getSongDetial_Array(ids)).songs
      for (let i = 0; i < frame.length; i++) {
        data[i].source = frame[i].source
        data[i].sourceId = frame[i].sourceId
      }
      this.display = data
    },
    resize,
    play(song) {
      play({
        id: song.id,
        action: 'play',
        source: song.source,
        sourceId: song.sourceId,
        data: null,
        callback: null
      },true,false)
    }
  },
  created() {
    watch(
      playlist,
      async () => {
        this.display = []
        await this.loadPlaylistSongs()
      },
      { deep: true, immediate: true }
    )
  }
}
</script>
<style scoped>
.playlist-obj {
  width: 27%;
  height: 80%;
  position: fixed;
  right: 0;
  bottom: calc(10% - 0.7rem);
  z-index: 99999;
  background: var(--app-theme-component);
  border-radius: 1rem 0 0 1rem;
  box-shadow: -0.3rem 0.3rem 0.5rem #2525251d;
  transition: 0.2s;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.7rem 0;
  gap: 1rem;
}
.playlist-obj .ti {
  width: 90%;
}
.ti:first-child {
  margin-top: 1rem;
}
.shell {
  width: 90%;
  height: fit-content;
  overflow: hidden;
}
.tracks {
  width: 90%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song {
  width: calc(100% - 1rem);
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  padding: 0.5rem;
  border-radius: 0.7rem;
}
.song:hover {
  background: var(--hover);
  .cover-shell .cover {
    filter: brightness(0.6);
  }
  .cover-shell svg {
    opacity: 1;
  }
}
.song .cover {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  flex-shrink: 0;
}
.song .cover-shell {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.song .cover-shell svg {
  width: 2em;
  position: absolute;
  z-index: 1;
  opacity: 0;
  transition: all 0.1s ease-in-out;
}
.song .cover-shell svg:active {
  transform: scale(0.9);
}
.song .info {
  display: block;
}
.song .info h3 {
  width: 15rem;
}
.song .info a {
  width: 15rem;
}
.highlight {
  background: var(--hover);
}
</style>
