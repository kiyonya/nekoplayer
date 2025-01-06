<template>
  <div class="tracks">
    <Song
      v-for="(song, index) in tracks"
      :cover="song.al.picUrl"
      :name="song.name"
      :artist="song.ar"
      :key="song.id"
      :id="song.id"
      :lazyOb="ob"
      :index="index"
      :album="song.al"
      :duration="song.dt"
      :mv="song.mv"
      :rs="this.rs"
      :tns="song.tns || null"
    ></Song>
  </div>
</template>
<script>
import Song from "./Song.vue";
import { ob } from "@/utils/libs";
export default {
    data(){
        return{
            ob:ob
        }
    },
  components: {
    Song,
  },
  props: ["tracks","rs"],
  mounted(){
    console.log(this.tracks)
  }
};
</script>
<style scoped>
.tracks {
  width: 95%;
  display: flex;
  flex-direction: column;
  scroll-snap-type: proximity;
}
</style>
