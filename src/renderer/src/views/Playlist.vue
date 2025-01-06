<template>
  <div class="playlist page" ref="playlist" :key="this.$route.params.id">
    <HeadInfo
      :cover="detial.coverImgUrl"
      :name="detial.name"
      :subtitle="
        detial.detailPageTitle ? `${detial.detailPageTitle} · ${detial.updateFrequency}` : ''
      "
      @subtitleclick="null"
      :creator="this.detial.creator ? detial.creator.nickname : null"
      :oncreatorclick="null"
      :info="`最后更新于${getDate(detial.trackUpdateTime)} · ${detial.trackCount}首歌`"
      :desc="detial.description"
      @descClick="null"
      @playall="this.$audio.playAll({ type: 'playlist', id: pid })"
    ></HeadInfo>

    <div class="tracks">
      <Song
        v-for="(song, index) in tracks"
        :musicInfo="{
          name: song.name,
          cover: song.al.picUrl,
          artist: song.ar,
          album: song.al,
          id: song.id,
          duration: song.dt,
          tns: song.tns || null,
          alia: song.alia,
          mv: song.mv
        }"
        :source="{
          type: 'playlist',
          id: this.pid,
          data: null,
          callback: null
        }"
        :action="'play'"
        :index="index"
        :select-mode="selectMode"
        @checked="(id)=>handleCheck(id)"
        @unchecked="(id)=>handleUncheck(id)"
      ></Song>
    </div>

    <span class="fulltime">{{ formatDuration(this.fullTime) }}</span>
  </div>
</template>
<script>
import * as req_playlist from '../api/playlist'
import Song from '@/components/Song.vue'
import { formatDuration, getDate } from '@/utils/timers'
import { formatNumber } from '@/utils/libs'
import { ob } from '@/utils/libs'
import HeadInfo from '@/components/HeadInfo.vue'
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue'
export default {
  components: {
    Song,
    HeadInfo,
    ContextMenu
  },
  data() {
    return {
      isNew: false,
      pid: '',
      tracks: [],
      page: 1,
      time: null,
      obs: ob,
      fullTime: 0,
      redo: false,
      detial: {},

      selectMode: false,
      select: new Set()
    }
  },
  beforeMount() {},
  methods: {
    async load() {
      this.detial = (await req_playlist.getPlaylistDetial(this.pid)).playlist
      this.tracks = (await req_playlist.getPlaylistMusic(this.pid, 10000, this.page)).songs
      for (let song of this.tracks) {
        this.fullTime += Math.round(song.dt / 1000)
      }
    },

    formatDuration,
    getDate,
    formatNumber,
    handleCheck(id){
      this.select.add(id)
      console.log(this.select)
    },
    handleUncheck(id){
      this.select.delete(id)
      console.log(this.select)
    }
  },
  created() {
    this.redo = false
    this.pid = this.$route.params.id
    this.load()
  },
  props: ['name', 'cover', 'sub', 'createTime', 'trackCount', 'playCount', 'tags', 'id']
}
</script>
<style scoped>
.tracks {
  width: 95%;
  display: flex;
  flex-direction: column;
  scroll-snap-type: proximity;
  margin-top: 1.2rem;
}

.playlist-top {
  position: relative;
  margin-top: 3rem;
  margin-bottom: 1.8rem;
  width: 93%;
  height: 18rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cover {
  height: 100%;
  aspect-ratio: 1/1;
  position: relative;
  display: flex;
  justify-content: center;
}

.cover .main {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 5%;
}

.cover .blur {
  width: 95%;
  aspect-ratio: 1/1;
  position: absolute;
  border-radius: 5%;
  z-index: -1;
  filter: blur(15px);
  bottom: -0.8rem;
  opacity: 0.4;
}

.playlist-detial {
  position: relative;
  width: 50%;
  height: 100%;
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  flex: 1;
}

.playlist-detial .name {
  margin-top: 0rem;
  font-size: 2.3rem;
}

.playlist-detial .reason {
  margin-top: 0.3rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #6970eb;
}

.playlist-detial .creator {
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.8rem;
}

.playlist-detial .creator span {
  font-size: 1.3rem;
  font-weight: 400;
  opacity: var(--text-opacity-1);
}

.playlist-detial .info {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  font-size: 1rem;
  opacity: var(--text-opacity-4);
}

.playlist-detial .tags {
  display: flex;
  flex-direction: row;
  gap: 0.9rem;
  font-size: 1rem;
}

.playlist-detial .tags span {
  background: var(--app-theme-component);
  padding: 0.1rem 0.5rem;
  border-radius: 1rem;
}

.desc {
  width: 70%;
  height: fit-content;
  display: -webkit-inline-box;
  margin: auto auto auto 0px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  text-overflow: ellipsis;
  opacity: var(--text-opacity-4);
  font-size: 0.9rem;
}

.btns {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin: auto auto 0px 0px;
  width: 100%;
  height: 2.5rem;
}

.btns button {
  height: 100%;
  aspect-ratio: 1/1;
  border: none;
  background: var(--app-theme-component);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 5px;
  color: var(--text-color);
  font-size: 1.2rem;
  gap: 0.2rem;
  box-shadow: 1px 2px 5px #00000015;
}

.btns button:first-child {
  padding: 0.4rem 1rem;
  aspect-ratio: auto;
  background: var(--app-theme-strong-background);
  font-weight: 600;
  color: white;
  fill: white;
}

.btns button .i {
  height: 1.5rem;
  aspect-ratio: 1/1;
}

.ts {
  width: 95%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ts span {
  position: absolute;
  font-size: medium;
  opacity: var(--text-opacity-4);
}

.ts span:nth-child(1) {
  left: calc(2.5% + 1.2rem);
}

.ts span:nth-child(2) {
  left: 35.5%;
}

.ts span:nth-child(3) {
  left: 64.2%;
}

.ts span:nth-child(2)::before,
span:nth-child(3)::before {
  background: var(--app-theme-component);
  border-radius: 0.5px;
  content: '';
  display: inline-block;
  height: 16px;
  inset-inline-start: -15px;
  position: absolute;
  top: calc(50% - 3px);
  transform: translateY(-50%);
  width: 1px;
}
.fulltime {
  margin-top: 2rem;
  margin-bottom: 5rem;
  margin-left: 2.5%;
  margin-right: auto;
  font-size: 0.9rem;
  opacity: var(--text-opacity-4);
}
.song-ctn {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
