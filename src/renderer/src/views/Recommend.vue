<template>
  <div class="page">
    <div class="rcmd">
      <div class="p-title"><span>今日推荐</span></div>
      <div class="banner">
        <!--每日推荐的代码-->
        <div
          class="daily-song"
          @click="
            () => {
              $router.push({ name: 'DailyRecommend' });
            }
          "
        >
          <h1 class="title">每日<br />推荐</h1>
          <div class="bg-shell">
            <img
              :src="recommendSongs[0] ? recommendSongs[0].al.picUrl : ''"
              alt=""
              class="main"
            />
            <img
              :src="recommendSongs[0] ? recommendSongs[0].al.picUrl : ''"
              alt=""
              class="blur"
            />
          </div>
        </div>
        <!--私人FM-->
        <div class="personal-fm" v-if="personalFM.length !== 0">
          <div class="backdrop">
            <div class="bg-shell">
                <img :src="personalFM[personalFMIndex].album.picUrl" alt="" class="main" />
            </div>
          </div>
          <img
            :src="personalFM[personalFMIndex].album.picUrl"
            alt=""
            class="cover"
          />
          <div class="personal-fm-info">
            <h2 class="ti">{{ personalFM[personalFMIndex].name }}</h2>
            <ArtistNameGroup
              :array="personalFM[personalFMIndex].artists"
            ></ArtistNameGroup>

            <div class="act">
              <button
                class="playbtn"
                @click="
                  play({id:personalFM[personalFMIndex].id,action:'addatindex',source:null,sourceId:personalFM[personalFMIndex].id,data:null,callback:null},true,true)
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="fa"
                >
                  <path
                    f
                    fill-rule="evenodd"
                    d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button class="next" @click="personalFMNext()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="fa"
                >
                  <path
                    fill-rule="evenodd"
                    d="M17.5 9.402c2 1.155 2 4.041 0 5.196l-9 5.196c-2 1.155-4.5-.288-4.5-2.598V6.804c0-2.31 2.5-3.753 4.5-2.598zM21 5a1 1 0 1 0-2 0v14a1 1 0 1 0 2 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <select
                name=""
                id="personal-fm-mode"
                v-model="personalFMMode"
                class="fmmode"
              >
                <option value="DEFAULT/">默认</option>
                <option value="aidj/">智能DJ</option>
                <option value="FAMILIAR/">熟悉的歌</option>
                <option value="EXPLORE/">探索</option>
                <option value="SCENE_RCMD/EXERCISE">锻炼</option>
                <option value="SCENE_RCMD/FOCUS">专注</option>
                <option value="SCENE_RCMD/NIGHT_EMO">深夜情感</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rcmd" v-if="show_officialPlaylist">
      <div class="p-title"><span>官方雷达</span></div>
      <div class="g-shell-6">
        <PlaylistCard
          v-for="p in officialPlaylist"
          :name="p.playlist.name"
          :cover="p.playlist.coverImgUrl"
          :key="p.playlist.id"
          :id="p.playlist.id"
        ></PlaylistCard>
      </div>
    </div>
    <div class="rcmd" v-if="show_recommendPlaylist">
      <div class="p-title"><span> 精选歌单</span>
      
      <RouterLink :to="{name:'Discover',query:{cat:'recommend'}}" class="linkout">查看更多</RouterLink>
      </div>
      <div class="g-shell-6">
        <PlaylistCard
          v-for="p in recommendPlaylist.slice(1, 13)"
          :name="p.name"
          :cover="p.picUrl"
          :key="p.id"
          :id="p.id"
          :sub="p.copyrite"
        ></PlaylistCard>
      </div>
    </div>

    <div class="rcmd" style="margin-top: 1rem">
      <div class="p-title">
        <span>新专速递</span>
        <div class="album-area">
          <span class="tip-cate">分类</span>
          <button
            :class="albumArea === 'all' ? 'album-area-seletor-selected' : ''"
            class="album-area-selector"
            @click="albumRequest('all')"
          >
            全部
          </button>
          <button
            :class="albumArea === 'zh' ? 'album-area-seletor-selected' : ''"
            class="album-area-selector"
            @click="albumRequest('zh')"
          >
            华语
          </button>
          <button
            :class="albumArea === 'ea' ? 'album-area-seletor-selected' : ''"
            class="album-area-selector"
            @click="albumRequest('ea')"
          >
            欧美
          </button>
          <button
            :class="albumArea === 'jp' ? 'album-area-seletor-selected' : ''"
            class="album-area-selector"
            @click="albumRequest('jp')"
          >
            日语
          </button>
          <button
            :class="albumArea === 'kr' ? 'album-area-seletor-selected' : ''"
            class="album-area-selector"
            @click="albumRequest('kr')"
          >
            韩语
          </button>
        </div>
      </div>

      <div class="g-shell-6" style="min-height: calc(22rem + 40px);margin-bottom: 5rem;">
          <AlbumCard
            v-for="p in newAlbum"
            :name="p.name"
            :cover="p.picUrl"
            :key="p.id"
            :size="p.size"
            :date="p.publishTime"
            :id="p.id"
          ></AlbumCard>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import * as recommend from "../api/recommend";
import PlaylistCard from "@/components/PlaylistCard.vue";
import AlbumCard from "@/components/AlbumCard.vue";
import ArtistNameGroup from "@/components/ArtistNameGroup.vue";
import { play } from "@/audioplay/player";
let show_recommendPlaylist = ref(true);
let show_officialPlaylist = ref(true);
const recommendSongs = ref([]);
const officialPlaylist = ref([]);
const recommendPlaylist = ref([]);
const newAlbum = ref([]);
const personalFM = ref([]);
let personalFMIndex = ref(0);
const personalFMMode = ref("DEFAULT/");
const albumArea = ref("all");
async function albumRequest(area) {
  albumArea.value = area;
  const ar = area || "all";
  newAlbum.value = (await recommend.getNewAlbum(ar)).albums;
}
onMounted(async () => {
  recommendSongs.value = (await recommend.getDailySong()).data.dailySongs;
  let fmmode = personalFMMode.value.split("/");
  personalFM.value = (await recommend.personalFM(fmmode[0], fmmode[1])).data;
  personalFMIndex.value = 0;
  officialPlaylist.value = await recommend.getRadio();
  recommendPlaylist.value = (await recommend.getRecommendPlaylist()).result;
  await albumRequest("all");
});

function personalFMNext() {
  if (personalFMIndex.value + 1 < personalFM.value.length) {
    personalFMIndex.value += 1;
  } else {
    personalFMIndex.value = 0;
  }
  play(personalFM.value[personalFMIndex.value].id, {
    rs: { type: "add", id: personalFM.value[personalFMIndex.value].id },
  });
}

watch(personalFMMode, async (n, o) => {
  let fmmode = personalFMMode.value.split("/");
  personalFM.value = (await recommend.personalFM(fmmode[0], fmmode[1])).data;
  personalFMIndex.value = 0;
});
</script>
<style scoped>
.rtop {
  width: 95%;
  height: 18rem;
  background: var(--app-theme-component);
  box-shadow: 2px 2px 10px #00000009;
  border-radius: 10px;
  margin-top: 3rem;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 1.5rem;
}

.rtop .changeRecommendSong {
  position: absolute;
  font-size: 1.05rem;
  top: 0.8rem;
  right: 1.8rem;
  font-weight: bold;
  opacity: var(--text-opacity-3);
  display: flex;
  align-items: center;
  cursor: pointer;
}

.rtop .changeRecommendSong img {
  width: 0.9rem;
  margin-right: 0.3rem;
}

.rtop .r-song-short {
  width: 70%;
  height: 80%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 13px;
  transition: 0.4s;
  position: absolute;
  right: 1.5rem;
  overflow: hidden;
}

.rtop .r-banner {
  width: 25%;
  height: 80%;
  background-color: var(--app-theme-component);
  position: absolute;
  left: 1.5rem;
}

.rcmd {
  width: 95%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(0, 0, 255, 0);
  position: relative;
  transition: 0.4s;
}


.album-area {
  width: fit-content;
  height: 2.25rem;
  margin: auto 0px auto auto;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1.5rem;
}

.album-area .tip-cate {
  font-size: 1.05rem;
  opacity: var(--text-opacity-4) !important;
}

.album-area .album-area-selector {
  width: fit-content;
  height: fit-content;
  font-size: 1.2rem;
  border: none;
  font-size: 1.05rem;
  font-weight: 600;
  opacity: var(--text-opacity-2);
  text-align: center;
  background-color: var(--app-theme-darker);
  cursor: pointer;
  color: var(--text-color);
  padding: 0.3rem 0.75rem 0.3rem 0.75rem;
  border-radius: 1.5rem;
  transition: 0.2s;
}
.album-area-seletor-selected {
  background-color: var(--app-theme-strong-background) !important;
}
.starpick-sub-shell {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  height: 100%;
  gap: 1.5rem;
}

.banner {
  width: 100%;
  height: 14rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
.daily-song {
  width: auto;
  padding: 1rem;
  height: auto;
  grid-column: 1/3;
  border-radius: 0.8rem;
  display: flex;
  position: relative;
  flex-shrink: 0;
}
.daily-song .title {
  color: #fff;
  font-size: 3rem;
  letter-spacing: 0.5rem;
  margin: auto auto 0 0;
}
.daily-song:hover .blur{
    bottom: -0.8rem;
    opacity: 0.3;
    
}

.personal-fm {
width: auto;
  height: auto;
  grid-column: 3/5;
  border-radius: 0.8rem;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  align-items: center;
}

.personal-fm .backdrop {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.personal-fm .backdrop img {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  object-fit: cover;
  filter: blur(10px) brightness(0.8);
  transform: scale(1.1);
}
.personal-fm .cover {
  height: 85%;
  aspect-ratio: 1/1;
  position: relative;
  margin-left: 2cqh;
  border-radius: 0.5rem;
}
.personal-fm .personal-fm-info {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  height: 85%;
  flex: 1;
  color: #fff !important;
}
.personal-fm .personal-fm-info .ti {
  font-size: 1.6rem;
}
.personal-fm .personal-fm-info .act {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.6rem;
  margin: auto auto 0 0;
  align-items: center;
}
.personal-fm .personal-fm-info .act button {
  width: 2.3rem;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border-radius: 50%;
  border: 1px solid #fff;
  fill: #fff;
}
.personal-fm .personal-fm-info .act button svg {
  fill: #fff;
}
.fmmode {
  height: fit-content;
  width: 7rem;
  padding: 0.3rem 0.4rem;
  font-size: 1rem;
  font-weight: 600;
  background: none;
  border: none;
  color: #fff;
  outline: none;
  margin: auto 0 auto auto;
  opacity: 0.95;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
.fmmode option {
  width: 7rem;
  background: var(--app-theme-component);
  color: var(--text-color);
  outline: none;
  border: none;
}
.linkout{
  color: var(--text-color);
  opacity: var(--text-opacity-2);
  font-size: 0.9rem;
  margin: auto 0 0 auto;
  text-decoration: none;
}
</style>
