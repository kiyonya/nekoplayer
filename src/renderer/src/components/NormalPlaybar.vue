<template>
  <div class="n-playbar" @click="showPlayer(true)">
    <Slider
      class="slider"
      @slider="
        (value) => {
          audio.currentTime = value * audioStatus.duration
          console.log(value)
        }
      "
      :debonunce="0"
      :value="audioStatus.currentTime"
      :total="audioStatus.duration"
    ></Slider>

    <div class="music-info">
      <img
        :src=" resize(musicInfo.cover,150)"
        class="playbar-cover"
        @click.stop="showPlayer"
      />
      <div class="n-playbar-info">
        <h4 class="musicname text-limit">{{ musicInfo.name }}</h4>
        <span class="musicartist"
          ><ArtistNameGroup :array="musicInfo.artist"></ArtistNameGroup
        ></span>
      </div>
    </div>
    <div class="playbar-m">
      <div class="widget-shell">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fa i">
            <path
              d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675t1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025t2.45 2.675T12 18.3m0-6.825"
            />
          </svg>
        </button>

        <button @click.stop="previous()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fa i">
            <path
              fill-rule="evenodd"
              d="m15.5 19.794l-9-5.196c-2-1.155-2-4.041 0-5.196l9-5.196c2-1.155 4.5.288 4.5 2.598v10.392c0 2.31-2.5 3.753-4.5 2.598M3 19a1 1 0 1 0 2 0V5a1 1 0 1 0-2 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button @click.stop="togglePlay()" v-if="audio.paused">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fa i"
            style="width: 2.3rem"
            viewBox="0 0 24 24"
          >
            <path d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4" />
          </svg>
        </button>

        <button @click.stop="togglePlay()" v-else="audio.paused">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fa i"
            style="width: 2.3rem"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m8 0h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
            />
          </svg>
        </button>

        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="fa i"
            viewBox="0 0 24 24"
            @click.stop="next()"
          >
            <path
              fill-rule="evenodd"
              d="M17.5 9.402c2 1.155 2 4.041 0 5.196l-9 5.196c-2 1.155-4.5-.288-4.5-2.598V6.804c0-2.31 2.5-3.753 4.5-2.598zM21 5a1 1 0 1 0-2 0v14a1 1 0 1 0 2 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button @click.stop="changePlaymode()">
          <svg xmlns="http://www.w3.org/2000/svg" class="fa i" viewBox="0 0 24 24">
            <!--列表-->
            <path
              v-if="playerData.mode == 'list'"
              fill-rule="evenodd"
              d="M7 6a1 1 0 0 1-.5.866l-3 1.732A1 1 0 0 1 2 7.732V4.268a1 1 0 0 1 1.5-.866l3 1.732A1 1 0 0 1 7 6m-4 5a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2zm6-5a1 1 0 0 1 1-1h11a1 1 0 1 1 0 2H10a1 1 0 0 1-1-1M3 17a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2z"
              clip-rule="evenodd"
            />
            <!--循环-->
            <path
              v-if="playerData.mode == 'loop'"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12V9a3 3 0 0 1 3-3h13m-3-3l3 3l-3 3m3 3v3a3 3 0 0 1-3 3H4m3 3l-3-3l3-3m4-4l1-1v4"
            />
            <!--随机-->
            <g v-if="playerData.mode == 'random'">
              <path
                d="M21.924 6.617a1 1 0 0 0-.217-.324l-3-3a1 1 0 1 0-1.414 1.414L18.586 6h-3.321a5 5 0 0 0-4.288 2.428l-3.67 6.115A3 3 0 0 1 4.736 16H3a1 1 0 1 0 0 2h1.735a5 5 0 0 0 4.288-2.428l3.67-6.115A3 3 0 0 1 15.264 8h3.32l-1.292 1.293a1 1 0 0 0 1.414 1.414l3-3A1 1 0 0 0 22 7m-.076-.383a1 1 0 0 1 .076.38z"
              />
              <path
                d="m21.706 17.708l-2.999 3a1 1 0 0 1-1.414-1.415L18.586 18h-3.321a5 5 0 0 1-4.288-2.428l-3.67-6.115A3 3 0 0 0 4.736 8H3a1 1 0 0 1 0-2h1.735a5 5 0 0 1 4.288 2.428l3.67 6.115A3 3 0 0 0 15.264 16h3.32l-1.292-1.293a1 1 0 0 1 1.414-1.414l3 3c.195.194.292.45.293.704V17a1 1 0 0 1-.294.708z"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
    <div class="playbar-a">
      <img src="@/assets/images/eq.svg" alt="" class="widget icon" />
      <img src="@/assets/images/download.svg" alt="" class="widget icon" />
      <img
        src="@/assets/images/list.svg"
        alt=""
        class="widget icon"
        @click.stop="togglePlaylisyBar()"
      />
    </div>
  </div>
</template>
<script>
import ProcessBar from './ProgressBar.vue'
import ArtistNameGroup from './ArtistNameGroup.vue'
import Slider from './Slider.vue'
import temp from '@/store/temp'
import { mapMutations, mapState } from 'vuex'
import { next, previous, changePlaymode, togglePlay } from '@/audioplay/audio-control'
import { store } from '@/store'
import { resize } from '@/utils/imageProcess'
export default {
  computed: {
    ...mapState(['playerData', 'musicInfo', 'audioStatus', 'showPlaylistBar']),
    audio() {
      return temp.audio
    }
  },
  data() {
    return {
      temp: temp
    }
  },
  methods: {
    ...mapMutations(['showPlayer']),
    next,
    previous,
    changePlaymode,
    togglePlay,
    togglePlaylisyBar() {
      if (this.showPlaylistBar) {
        store.commit('showPlaylistBar', false)
      } else {
        store.commit('showPlaylistBar', true)
      }
    },
    resize
  },
  components: {
    ProcessBar,
    ArtistNameGroup,
    Slider
  }
}
</script>
<style scoped>
.n-playbar {
  padding: 0 5% 0 5%;
  width: calc(100% - 10%);
  height: 4rem;
  position: fixed;
  left: 0;
  bottom: 0;
  background: var(--app-theme-op);
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ' . . . ';
  z-index: 100;
  backdrop-filter: blur(20px) saturate(0.5);
}

.n-playbar .music-info {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.n-playbar .music-info .playbar-cover {
  height: 3rem;
  aspect-ratio: 1/1;
  object-fit: cover;
  margin-left: 1rem;
  border-radius: 10%;
}

.n-playbar .playbar-m {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
}

.n-playbar .widget-shell {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.4rem;
}

.n-playbar .widget {
  width: 1.7rem;
  opacity: 0.75;
}

.n-playbar .small {
  padding: 0 1.2rem 0 1.2rem;
  width: 1.3rem !important;
}

.n-playbar .musicname {
  font-size: 1.1em;
  margin: 0px;
  opacity: 0.7;
  width: 100%;
}

.n-playbar .n-playbar-info {
  width: fit-content;
  height: 80%;
  letter-spacing: normal;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  justify-content: center;
  margin-left: 0.75em;
}

.n-playbar .musicartist {
  font-size: 1rem;
  margin: 0px;
  opacity: 0.5;
}
.n-playbar .playbar-a {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 2.25rem auto auto;
  gap: 1.2rem;
}
.n-playbar .playbar-a img {
  width: 1.6rem;
}

.slider {
  --height: 0.12rem;
  --l: var(--progress-slider-progress);
  --r: var(--progress-slider-progress);
  --b: var(--progress-slider-background);
  width: 100%;
  height: var(--height);
  position: absolute;
  top: var(--height * -1);
  left: 0;
}

.i {
  width: 1.5rem;
}
button {
  appearance: none;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 1/1;
  padding: 0.3rem;
  border-radius: 20%;

  transition: 0.2s;
}
button:hover {
  background: var(--hover);
}
</style>
