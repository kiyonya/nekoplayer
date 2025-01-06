<template>
  <div class="page" >
    <ImportPlaylist @close="showImporter = false" v-if="showImporter"></ImportPlaylist>
    <div class="shell">
      <h1 class="g-ti">我创建的歌单
        <button @click="showImporter=true">来自外部</button>
      </h1>
      <div class="g-shell-6 area">
        <PlaylistCard v-for="pl in playlist?.create" :name="pl.name" :cover="pl.coverImgUrl" :id="pl.id"></PlaylistCard>
      </div>
    </div>
    <div class="shell">
      <h1 class="g-ti">我的收藏</h1>
      <div class="selector">
        <span @click="collectDisplayType = 'playlist'" :class="collectDisplayType == 'playlist' ? 'sel' : ''">歌单</span>
        <span @click="collectDisplayType = 'album'" :class="collectDisplayType == 'album' ? 'sel' : ''">专辑</span>
        <span @click="collectDisplayType = 'video'" :class="collectDisplayType == 'video' ? 'sel' : ''">视频</span>
      </div>
      <div class="g-shell-6 area playlist" v-show="collectDisplayType == 'playlist'" v-if="playlist">
        <PlaylistCard v-for="pl in playlist.collect" :name="pl.name" :cover="pl.coverImgUrl" :id="pl.id"></PlaylistCard>
      </div>

      <div class="g-shell-6 area album" v-show="collectDisplayType == 'album'" v-if="collectAlbums">
        <AlbumCard v-for="al in collectAlbums.data" :name="al.name" :size="al.size" :cover="al.picUrl"  :id="al.id" :hideInfo="true"></AlbumCard>
      </div>

      <div class="g-shell-5 area video" v-show="collectDisplayType == 'video'" v-if="collectMV">
        <MvCard v-for="mv in collectMV.data" :cover="mv.coverUrl" :name="mv.title" :duration="mv.durationms" :id="mv.vid" ></MvCard>
        <!--网易云你接口单词拼错了-->
      </div>
    </div>
  </div>
</template>
<script>
import { watch } from "vue";
import * as user from "../api/user";
import { profile } from "@/lib/auth";
import PlaylistCard from "@/components/PlaylistCard.vue";
import AlbumCard from "@/components/AlbumCard.vue";
import MvCard from "@/components/MvCard.vue";
import ModalWindow from "@/components/windows/ModalWindow.vue";
import ImportPlaylist from "@/components/windows/ImportPlaylist.vue";
export default {
  components: {
    PlaylistCard,AlbumCard,MvCard,ModalWindow,ImportPlaylist
  },
  data() {
    return {
      playlist: null,
      collectAlbums:null,
      collectDisplayType:'playlist',
      collectMV:null,
      showImporter:false
    };
  },
  methods: {
    async load() {
        this.playlist = await user.getUserPlaylist(profile.value.userId);
        this.collectAlbums = await user.getUserCollectedAlbums()
        this.collectMV = await user.getUserCollectedMV()
      console.log(this.collectMV)

    },
  },
  created() {
    if(profile.value.userId){
      this.load()
    }
    else{
      watch(profile,()=>{this.load()})
    }
  },
};
</script>
<style scoped>
.page{
    gap: 5rem;
}
.shell:first-child {
  margin-top: 2rem;
}
.shell:last-child{
  margin-bottom: 5rem;
}
.shell {
  display: flex;
  flex-direction: column;
  width: 95%;
  height: fit-content;
}
.shell .area {
  width: 100%;
  height: fit-content;
}
.selector{
  width: fit-content;
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  margin-bottom: 1rem;
}
.selector span{
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 1.2rem;
  background-color: var(--hover);
  border-radius: 0.5rem;
  transition:  all .2s ease-in-out;
  opacity: var(--text-opacity-2);
}
.sel{
  color: var(--app-theme-strong);
}
.selector span:active{
  transform: scale(0.95);
}
</style>
