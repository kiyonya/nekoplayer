<template>
  <div
    class="re-song"
    @dblclick="play"
    :class="this.$store.state.musicInfo.id == this.id ? 'onplay' : ''"
  >
    <img :src="this.cover + '?param=75y75'" alt="" class="music-cover" />
    <div class="song-info">
      <p class="song-name">{{ this.name }}</p>
      <ArtistNameGroup :array="this.artist" style="max-width: 12rem"></ArtistNameGroup>
    </div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 24 24"
      class="play-btn"
      @click="play"
    >
      <path
        fill-rule="evenodd"
        d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>
<script>
import ArtistNameGroup from './ArtistNameGroup.vue'
import { play } from '@/audioplay/player'
export default {
  components: {
    ArtistNameGroup
  },
  data() {
    return {}
  },
  methods: {
    play() {
      play(
        {
          id: this.id,
          action: 'addatindex',
          source: 'artist',
          sourceId: "changed",
          data: null,
          callback: null
        },
        true,
        true
      )
    }
  },
  props: ['cover', 'name', 'artist', 'id']
}
</script>
<style>
.re-song {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 5px;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 0.2s;
  cursor: pointer;
  scroll-snap-align: start;
}

.re-song:nth-child(3n - 2) {
  animation-delay: 0s;
}

.re-song:nth-child(3n - 1) {
  animation-delay: 0.1s;
}

.re-song:nth-child(3n) {
  animation-delay: 0.2s;
}

.re-song:hover {
  box-shadow: 1px 1px 10px #00000013;
  background-color: var(--hover);
}

.re-song .music-cover {
  --s: 0.75;
  height: 3rem;
  aspect-ratio: 1/1;
  object-fit: cover;
  margin-right: 1cqh;
  margin-left: calc(((1 - var(--s)) / 2) * 3rem);
  border-radius: 5px;
  transform: scale(var(--s) * 1.1);
}

.re-song .song-info {
  display: flex;
  flex-direction: column;
}

.re-song .song-name {
  font-size: 1.05rem;
  font-weight: 600;
  opacity: var(--text-opacity-1);
  width: 11.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.re-song .song-artist {
  width: 11.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  opacity: var(--text-opacity-2);
  letter-spacing: -0.03rem;
}

.re-song .play-btn {
  width: 1.65rem;
  height: 1.65rem;
  margin: auto 4% auto auto;
  opacity: var(--color-comp-opacity);
  fill: var(--color-comp);
}
</style>
