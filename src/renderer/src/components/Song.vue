<template>
  <div
    class="song-shell"
    @dblclick="play"
    ref="song"
    :class="this.$store.state.musicInfo.id == musicInfo.id ? 'onplay' : ''"
    :style="{pointerEvents:selectMode ? 'none' : 'auto'}"
  >
    <span class="serial" v-if="!selectMode">{{ (index + 1).toString().padStart(2, '0') }}</span>
    <input type="checkbox" name="" id="" v-show="selectMode" class="selector" @change="handleChecked($event)">
    <div class="cover-shell">
      <img src="@/assets/images/play-solid.svg" alt="" class="play-btn" @click="play" />
      <img :data-src="resize(musicInfo.cover, 100)" class="lazyload cover" ref="cover" />
    </div>
    <div class="info">
      <span class="title text-limit"
        >{{ musicInfo.name
        }}<span class="trans-name" v-if="musicInfo.alia?.length"
          >({{ musicInfo.alia[0] || '' }})</span
        ></span
      >
      <ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup>
    </div>

    <RouterLink
      class="artist-name-ref album"
      :to="{ name: 'Album', params: { id: musicInfo.album.id } }"
      v-if="musicInfo.album"
      >{{ musicInfo.album.name }}</RouterLink
    >

    <span class="time" v-if="musicInfo.duration">{{ mmss(musicInfo.duration) }}</span>
    <span class="time date" v-if="musicInfo.date">{{ getDate(musicInfo.date) }}</span>

    <div class="act">
      <img
        src="@/assets/images/video.svg"
        alt=""
        v-if="musicInfo.mv"
        class="icon"
        @click="toMv(musicInfo.mv)"
      />
    </div>
  </div>
</template>
<script>
import { mmss } from '@/utils/timers'
import { formatBytes, ob } from '@/utils/libs'
import { getDate } from '@/utils/timers'
import ContextMenu from './ContextMenu/ContextMenu.vue'
import { play } from '@/audioplay/player'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { observer } from '@/lib/lazyload'
import { resize } from '@/utils/imageProcess'
export default {
  components: {
    ContextMenu,
    ArtistNameGroup
  },
  data() {
    return {
      el: undefined,
      text: '',
      checked:false
    }
  },
  props: {
    musicInfo: {
      type: Object,
      default: {
        cover: '',
        name: '音乐',
        artist: [],
        album: [],
        duration: 0,
        id: 0,
        tns: null,
        alia: null
      }
    },
    action: {
      type: String,
      default: 'play'
    },
    source: {
      type: Object
    },
    index: {
      type: Number
    },
    selectMode:{
      type:Boolean
    }
  },
  methods: {
    mmss,
    formatBytes,
    getDate,
    toMv(id) {
      this.$router.push({
        name: 'MV',
        params: {
          id: id
        }
      })
    },
    play() {
      if(this.selectMode){return}
      play({
        id: this.musicInfo.id,
        action: this.action,
        source: this.source.type,
        sourceId: this.source.id,
        data: this.source.data,
        callback: this.source.callback
      })
    },
    resize,
    handleChecked(event){
      const value = event.target.checked;
      if(value){
        this.checked = true
        this.$emit("checked",this.musicInfo.id)
      }
      else{
        this.checked = false
        this.$emit("unchecked",this.musicInfo.id)
      }
    }
  },

  mounted() {
    observer(this.$refs.song)
  }
}
</script>
<style scoped>
.color {
  background: var(--song-gap) !important;
}
.song-shell {
  animation: song-in 0.4s;
  width: 100%;
  height: 4rem;
  transition: 0.1s;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-color);
  border-radius: 5px;
  position: relative;
}

.song-shell:hover {
  background: var(--hover);
  box-shadow: 1px 1px 10px #00000014;
}

.song-shell:hover {
  .play-btn {
    opacity: 1;
  }

  .cover {
    filter: brightness(0.6);
  }
}

.serial {
  font-size: 1rem;
  font-weight: 600;
  margin-left: 1.2rem;
  opacity: 0.7;
  color: var(--text) !important;
}

.cover-shell {
  height: 80%;
  aspect-ratio: 1/1;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.play-btn {
  position: absolute;
  width: 60%;
  aspect-ratio: 1/1;
  opacity: 0;
  z-index: 5;
  filter: invert(1);
}

.cover {
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 5px;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1cqw;
  height: 80%;
  position: relative;
}

.info .title {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: var(--text-opacity-2);
  max-width: 20cqw;
}

.info .artist {
  font-size: 0.9rem;
  opacity: var(--text-opacity-3);
  max-width: 20cqw;
}

.album {
  font-size: 1rem;
  display: block;
  position: absolute;
  left: 35%;
  width: 310px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: var(--text-opacity-2);
}

.album::before {
  display: none;
}

.time {
  font-size: 1.1rem;
  display: block;
  position: absolute;
  left: 65%;
  opacity: var(--text-opacity-1);
}

.act {
  position: absolute;
  width: fit-content;
  right: 3rem;
  display: flex;
  justify-content: right;
  gap: 2rem;
}

.act img {
  width: 1.5rem;
  opacity: 0.8;
}

.time {
  font-size: 15px;
  display: block;
  position: absolute;
  left: 65%;
  opacity: 0.85;
}

.song-shell .popline {
  width: 120px;
  height: 3px;
  position: absolute;
  overflow: hidden;
  left: 75%;
  background-color: #ffffff46;
  border-radius: 5px;
}

.song-shell .terminal {
  width: fit-content;
  height: fit-content;
  position: absolute;
  overflow: hidden;
  left: 75%;
  color: var(--text);
  font-size: 14px;
  opacity: 0.7;
}

.song-shell .popline .popline-inner {
  width: inherit;
  height: 3px;
  position: absolute;
  left: 0;
  top: 0;
  background: var(--musicPopStatusColor);
}

.song-shell .if {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: fit-content;
  justify-content: center;
  line-height: 18px;
  margin-left: 8px;
}

.song-shell .if .name {
  font-size: 16px;
  font-weight: 600;
  width: 340px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-shell .if .name .trans {
  opacity: 0.65;
  font-size: 16px;
  font-weight: 400;
  margin-left: 5px;
}

.song-shell .if .ar-main {
  font-size: 15px;
  transform: translateY(4px);
  cursor: pointer;
}

.song-shell .if .ar-main .ar-item {
  opacity: 0.75;
  transform: translateY(4px);
}

.song-shell .if .ar-main p {
  opacity: 0.75;
  transform: translateY(4px);
}

.song-shell .if .ar-main .ar-item:hover {
  opacity: 1;
  color: #67dff4;
}

.failed {
  opacity: 0.3 !important;
}

.failed:hover {
  color: inherit;
}
.trans-name {
  opacity: 0.5;
  margin-left: 0.5rem;
}
.selector{
  width: 1.2rem;
  height: 1.2rem;
  pointer-events: all;
  margin-left: 1rem;
}
</style>
