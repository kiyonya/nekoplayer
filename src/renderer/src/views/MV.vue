<template>
  <div class="page">
    <VideoPlayer
      :id="this.id"
      :brs="data.brs"
      :cover="data.cover"
      class="video-player"
      v-if="data"
    ></VideoPlayer>
    <div class="info">
      <div class="video-info">
        <h1 class="name">{{ data?.name }}</h1>
        <span class="count"
          >{{ data?.publishTime }}&nbsp;{{ formatNumber(data?.playCount) }}次播放</span
        >
        <p class="desc">{{ data?.desc }}</p>
      
      
      </div>
      <div class="artist">
        <h2 class="name" @click="this.$router.push({name:'Artist',params:{id:data?.artists[0]?.id}})">{{ data?.artists[0]?.name }}</h2>
      </div>
    </div>
    
  </div>
</template>
<script>
import VideoPlayer from '@/components/VideoPlayer.vue'
import * as req_mv from '../api/mv'
import temp from '@/store/temp'
import { formatNumber } from '@/utils/libs'
export default {
  components: {
    VideoPlayer
  },
  data() {
    return {
      data: null,
      brs: []
    }
  },
  methods: {
    async loadMv(id) {
      this.data = (await req_mv.getMvDetial(id)).data
      console.log(this.data)
    },
    formatNumber
  },
  created() {
    this.loadMv(this.id)
    window.scrollTo({ top: 0 })
  },
  props: ['id'],
  mounted() {
    temp.audio.pause()
  }
}
</script>
<style scoped>
.page {
  padding-bottom: 5rem;
}
.video-player {
  width: 95%;
  height: 85vh;
  position: relative;
  margin-top: 2rem;
  border-radius: 1rem;
}
.info {
  width: 95%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 3.5rem;
}
.video-info {
  width: fit-content;
  height: fit-content;
  
  display: flex;
  flex-direction: column;
}
.video-info .name {
  font-size: 2rem;
  opacity: var(--text-opacity-1);
}
.video-info .count {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: var(--text-opacity-3);
}
.desc {
  width: 50%;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: var(--text-opacity-3);
  text-align: left;
  margin-top: 1rem;
}
.artist{
  width: fit-content;
  height: fit-content;
  margin: 0 0 auto auto;
  opacity: var(--text-opacity-1);
}
.artist:hover{
  text-decoration: underline;
}
</style>
