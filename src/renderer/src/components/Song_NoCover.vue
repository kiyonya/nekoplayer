<template>
  <div
    class="song-nc"
    @dblclick="play"
    :class="this.$store.state.musicInfo.id == musicInfo.id ? 'onplay' : ''"
  >
    <div class="serial">{{ (index + 1).toString().padStart(2, '0') }}</div>
    <button class="play-btn" @click="play">
      <Icon icon="fluent:play-16-filled" class="icon" />
    </button>
    <span class="name text-limit"
      >{{ musicInfo.name
      }}<span class="trans-name" v-if="musicInfo.tns?.length">({{ musicInfo.tns[0] }})</span></span
    >
    <div class="artist">
      <ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup>
    </div>

    <span class="time">{{ this.mmss(musicInfo.duration) }}</span>
    <div class="act">
      <img src="@/assets/images/video.svg" alt="" v-if="musicInfo.mv" class="icon" />
      <img src="@/assets/images/like.svg" alt="" class="icon" />
    </div>
  </div>
</template>
<script>
import { mmss } from '@/utils/timers'
import { play } from '@/audioplay/player'
import ArtistNameGroup from './ArtistNameGroup.vue'
import { store } from '@/store'
import { Icon } from '@iconify/vue'
export default {
  computed: {
    musicId() {
      return store.state.musicInfo.id
    }
  },
  components: {
    ArtistNameGroup,
    Icon
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
    }
  },
  methods: {
    mmss,
    play() {
      play({
        id: this.musicInfo.id,
        action: this.action,
        source: this.source.type,
        sourceId: this.source.id,
        data: this.source.data,
        callback: this.source.callback
      })
    }
  }
}
</script>
<style scoped>
.color {
  background: var(--song-gap);
}

.song-nc {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: var(--text-color);
  border-radius: 5px;
  position: relative;
}

.song-nc:hover {
  background-color: var(--hover);
  box-shadow: 1px 1px 10px #00000014;
}

.song-nc:hover {
  .serial {
    display: none;
  }

  .play-btn {
    display: flex;
  }
}

.serial {
  font-size: 1.1rem;
  width: 1.5rem;
  font-weight: 600;
  margin-left: 1.5rem;
  opacity: 0.7;
  color: var(--text);
  text-align: center;
}

.play-btn {
  width: 1.5rem;
  margin-left: 1.5rem;
  opacity: 0.7;
  display: none;
  color: inherit;
  background-color: transparent;
  border: none;

  align-items: center;
  justify-content: center;
}
.icon {
  width: 1.6rem;
  height: 1.6rem;
  color: inherit;
}
.name {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: var(--text-opacity-2);
  max-width: 20vw;
  margin-left: 1.2cqw;
}

.artist-name-ref::before {
  content: '/';
  width: 0;
}

.artist {
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

.time {
  font-size: 1rem;
  display: block;
  position: absolute;
  left: 65%;
  opacity: 0.85;
}

.act {
  position: absolute;
  width: fit-content;
  right: 2rem;
  display: flex;
  justify-content: right;
  gap: 2rem;
}

.act img {
  width: 1.5rem;
  opacity: 0.8;
}
.trans-name {
  opacity: 0.5;
  margin-left: 0.5rem;
}
</style>
