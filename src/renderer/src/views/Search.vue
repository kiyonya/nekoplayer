<template>
  <div class="page search" v-if="data">
    <div class="g2">
      <div class="area album" v-if="data.result.album" :key="this.key">
        <h2 class="ti">
          专辑

          <RouterLink
            class="more"
            :to="{ name: 'SearchDetial', query: { key: key } }"
            >查看更多</RouterLink
          >
        </h2>
        <div class="grid3">
          <AlbumCard
            v-for="album in data.result.album.albums.slice(0, 3)"
            :name="album.name"
            :cover="album.picUrl"
            :id="album.id"
            :size="album.size"
            :date="album.publishTime"
          ></AlbumCard>
        </div>
      </div>
      <div class="area artist" v-if="data.result.artist" :key="this.key">
        <h2 class="ti">
          艺人

          <RouterLink
            class="more"
            :to="{ name: 'SearchDetial', query: { key: key } }"
            >查看更多</RouterLink
          >
        </h2>
        <div class="grid3">
          <ArtistCard
            v-for="artist in data.result.artist.artists.slice(0, 3)"
            :name="artist.name"
            :id="artist.id"
            :cover="artist.picUrl"
          ></ArtistCard>
        </div>
      </div>
    </div>
    <div class="g1" :key="this.key">
      <h2 class="ti">
        单曲
        <RouterLink
          class="more"
          :to="{ name: 'SearchDetial', query: { key: key } }"
          >查看更多</RouterLink
        >
      </h2>
      <div class="shell">
        <div class="grid4">
          <Song_Small
            v-for="song in songs.slice(0, 16)"
            :cover="song.al.picUrl"
            :name="song.name"
            :artist="song.ar"
            :key="song.id"
            :id="song.id"
            class="song"
          ></Song_Small>
        </div>
      </div>
    </div>

    <div class="g1" v-if="data.result.playList?.playLists">
      <h2 class="ti">
        歌单

        <RouterLink
          class="more"
          :to="{ name: 'SearchDetial', query: { key: key, type: 10 } }"
          >查看更多</RouterLink
        >
      </h2>
      <div class="g-shell-6">
        <PlaylistCard
          v-for="pl in data.result.playList.playLists.slice(0, 6)"
          :name="pl.name"
          :cover="pl.coverImgUrl"
          :id="pl.id"
        ></PlaylistCard>
      </div>
    </div>

    <div class="g1" v-if="mvs.result?.mvs">
      <h2 class="ti">
        视频
        <RouterLink
          class="more"
          :to="{ name: 'SearchDetial', query: { key: key, type: 100 } }"
          >查看更多</RouterLink
        >
      </h2>
      <div class="g-shell-5">
        <MvCard v-for="mv in mvs.result?.mvs.slice(0,5) " :name="mv.name" :cover="mv.cover" :id="mv.id" :playCount="mv.playCount" :allowPreview="false" :duration="mv.duration"></MvCard>
      </div>
    </div>
  </div>
</template>
<script>
import Rows from "@/components/Rows.vue";
import * as req_search from "../api/search";
import { ref } from "vue";
import ArtistCard from "@/components/ArtistCard.vue";
import PlaylistCard from "@/components/PlaylistCard.vue";
import AlbumCard from "@/components/AlbumCard.vue";
import Song_Small from "@/components/Song_Small.vue";
import { getSongDetial_Array } from "@/api/artist";
import MvCard from "@/components/MvCard.vue";
import { RouterLink } from "vue-router";
export default {
  components: {
    Rows,
    ArtistCard,
    PlaylistCard,
    AlbumCard,
    Song_Small,
    PlaylistCard,MvCard
  },
  data() {
    return {
      key: "",
      data: null,
      songs: null,
      mvs:null
    };
  },
  methods: {
    async loadSearch(key) {
      const data = await req_search.search(1018, key, 30, 1);
      let songsData = await req_search.search(1, key, 16, 1);
      this.songs = (
        await getSongDetial_Array(
          songsData.result.songs.map((song) => {
            return song.id;
          })
        )
      ).songs;

      this.mvs = await req_search.search(1004,key,5,1)

      console.log(data);
      this.data = data;
    },
  },
  created() {
    //拿到关键词
    const query = this.$route.query;
    this.key = query.key;
    this.loadSearch(query.key);
  },
};
</script>
<style scoped>
.search {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.ti {
  width: 100%;
  margin: 0 auto 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: end;
}
.ti .more {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  opacity: var(--text-opacity-4);
  margin: 0 0 0 auto;
}
.g2 {
  width: 95%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.g2 .area {
  width: 45%;
  position: relative;
}
.grid3 {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.grid4 {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.4rem;
  flex-shrink: 0;
}
.shell {
  width: 100%;
  height: 17rem;
  position: relative;
}
.g1 {
  width: 95%;
  position: relative;
  height: fit-content;
}
.g1:last-child {
  margin-bottom: 5rem;
}
.rows {
  height: 100%;
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
}
</style>
