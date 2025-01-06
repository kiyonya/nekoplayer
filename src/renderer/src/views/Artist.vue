<template>
    <div class="page">
        <img :src="artistInfo?.picUrl" alt="" class="abg" @click="this.imgViewerShow = true" v-if="artistInfo">
        <div class="ainfo" v-if="artistDetial">
            <img :src="artistInfo?.img1v1Url" alt="" class="ava">
            <div class="info">
                <h2 class="name">{{ artistInfo?.name }}</h2>
                <div class="tags">
                    <span v-for="idtag in artistDetial?.secondaryExpertIdentiy">{{ idtag['expertIdentiyName'] }}</span>
                </div>
                <p class="desc" @click="this.showDetial = true">{{ artistInfo?.briefDesc.replace('\n\n', '\n') }}</p>
            </div>
            <div class="ac">
                <div class="count">
                    <div class="cell"><span>单曲数</span>
                        <h3>{{ artistInfo?.musicSize }}</h3>
                    </div>
                    <hr>
                    <div class="cell"><span>专辑数</span>
                        <h3>{{ artistInfo?.albumSize }}</h3>
                    </div>
                    <hr>
                    <div class="cell"><span>MV数</span>
                        <h3>{{ artistInfo?.mvSize }}</h3>
                    </div>
                </div>
                <div class="act">
                    <button class="followed btn" v-if="artistInfo?.followed"><img src="@/assets/images/s-list.svg" alt=""
                            class="i icon">已关注</button>
                    <button class="follow btn" v-if="!artistInfo?.followed"><img src="@/assets/images/like.svg" alt=""
                            class="i icon">关注</button>
                </div>
            </div>
        </div>

        <div class="banner">
            <div class="album" @click="this.$router.push({
                name:'Album',
                params:{id:latestAlbum.id}
            })">
                <div class="s-title"><span>最新发布</span></div>
                <div class="album-display" v-if="latestAlbum">
                    <img :src="this.latestAlbum?.picUrl" alt="" class="latest-cover">
                    <div class="latest-info">
                        <span class="latest-time">{{ this.getDate(this.latestAlbum?.publishTime) }}</span>
                        <h3 class="latest-name">{{ this.latestAlbum?.name }}</h3>
                        <span class="latest-size">共{{ this.latestAlbum?.size }}首</span>
                    </div>
                </div>
            </div>

            <div class="songs" v-if="artistSongs">
                <div class="s-title"><span>热门歌曲</span></div>
                <Rows :row="3" :length="artistSongs?.length" :gap="['0.5rem','0.5rem']"  class="rows">
                    <Song_Small v-for="(song) in artistSongs" :cover="song.al.picUrl" :name="song.name" :artist="song.ar"
                    :key="song.id" :id="song.id" class="song"></Song_Small>
                </Rows>
            </div>

        </div>


        <div class="albums" v-if="albums">
            <div class="p-title"><span>歌手专辑</span></div>
            <div class="g-shell-6">
                <AlbumCard v-for="p in albums" :name="p.name" :cover="p.picUrl" :key="p.id" :size="p.size"
                    :date="p.publishTime" :id="p.id"></AlbumCard>
            </div>
        </div>

        <div class="mvs" v-if="mvs">
            <div class="p-title"><span>歌手MV</span></div>
            <div class="g-shell-5">
                <MvCard v-for="(mv, index) in this.mvs" :cover="mv.imgurl16v9" :name="mv.name" :date="mv.publishTime"
                    :duration="mv.duration" :playCount="mv.playCount" :id="mv.id" :key="mv.id" :allowPreview="true">
                </MvCard>
            </div>
        </div>

        <div class="simi" v-if="simi">
            <div class="p-title"><span>和{{ artistInfo.name }}相似的歌手</span></div>
            <div class="g-shell-6">
                <ArtistCard v-for="(ar, index) in simi.slice(0, 6)" :cover="ar.img1v1Url" :name=ar.name :id="ar.id" :key="ar.id"></ArtistCard>
            </div>
        </div>


        <!--介绍窗口-->
        <WindowDescription :ctx="[{ti:'歌手简介',txt:artistInfo.briefDesc},...this.description]" :title="this.artistInfo.name" @close="this.showDetial = false"
            v-if="this.showDetial"></WindowDescription>

        <!--图片预览器-->
        <ImgViewer v-if="this.imgViewerShow" @close="this.imgViewerShow = false" :img="this.artistInfo.picUrl">
        </ImgViewer>
    </div>
</template>
<script>
import { ref, render } from 'vue';
import * as req_artist from '../api/artist'
import ImgViewer from '@/components/Windows_WebImgViewer.vue';
import PlaylistCard from '@/components/PlaylistCard.vue';
import { getDate } from '@/utils/timers';
import ScrollerDisplaySongsGrid from '@/components/ScrollerDisplaySongsGrid.vue';
import AlbumCard from '@/components/AlbumCard.vue';
import MvCard from '@/components/MvCard.vue';
import ArtistCard from '@/components/ArtistCard.vue';
import WindowDescription from '@/components/Window_Description.vue';
import { artistSp } from '@/utils/eggs';
import Rows from '@/components/Rows.vue';
import Song_Small from '@/components/Song_Small.vue';
export default {
    components: {
        ImgViewer, PlaylistCard, ScrollerDisplaySongsGrid, AlbumCard, MvCard, ArtistCard, WindowDescription,Rows,Song_Small
    },
    data() {
        return {
            arid: '',
            imgViewerShow: false,
            artistInfo: null,
            artistDetial: null,
            artistSongs: null,
            latestAlbum: null,
            albums: null,
            mvs: null,
            simi: null,
            showDetial: false,
            description: []
        }
    },
    methods: {
        //信息获取
        async loadArtist(arid) {
            const artist = await req_artist.getArtistBriefAndSongs(arid)
            const albums = (await req_artist.getArtistAlbums(arid, 1, 7)).hotAlbums
            this.latestAlbum = albums[0]
            this.albums = albums.slice(1,)
            this.artistInfo = artist.artist
            this.artistSongs = (await req_artist.getSongDetial_Array(artist.hotSongs.map((item) => { return item.id }))).songs
            this.mvs = (await req_artist.getMvs(arid, 1, 5)).mvs
            this.simi = (await req_artist.getSimiArtist(arid)).artists
        },
        async queryArtistDetial(arid) {
            this.artistDetial = (await req_artist.getArtistInfo(arid)).data
        },
        getDate,
        async getMeta(id) {
            const ctx = (await req_artist.getDesc(id)).introduction
            if (ctx.length > 0) {
                this.description = ctx
            }
            if (Object.keys(artistSp).includes(id)) {
                this.description.push(artistSp[id])
            }
        }
    },
    created() {
        this.arid = this.$route.params.id
        this.loadArtist(this.arid)
        this.queryArtistDetial(this.arid)
        this.getMeta(this.arid)
    },

}
</script>
<style scoped>
.page {
    --top-height: 50vh
}

.abg {
    width: 100%;
    height: var(--top-height);
    object-fit: cover;
    position: absolute;
    z-index: 0;
    margin: auto;
    filter: brightness(0.9);
}

.ainfo {
    width: 98%;
    height: 16vh;
    background: var(--app-theme-component);
    position: relative;
    margin-top: calc(var(--top-height) - 4vh);
    border-radius: 8px;
    box-shadow: 2px 2px 10px 10px rgba(0, 0, 0, 0.093);
    display: flex;
    flex-direction: row;
    align-items: center;
}

.ava {
    height: 85%;
    aspect-ratio: 1/1;
    margin-left: 0.8rem;
    /*border-radius: 50%;*/
    border-radius: 0.4rem;
    border: 1px solid var(--app-theme);
}

.info {
    width: 50%;
    height: 80%;
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
}

.name {
    font-size: 1.5rem;
    opacity: var(--text-opacity-2);
}

.transName {
    font-size: 0.9rem;
    opacity: var(--text-opacity-3);
}

.desc {
    font-size: 1.1rem;
    opacity: var(--text-opacity-2);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    margin: auto auto 0px auto;
}

.desc:hover {
    text-decoration: underline;
}

.tags {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 0.2rem;
    gap: 1rem;
}

.tags span {
    background: var(--app-theme-strong-background);
    color: var(--text-color);
    padding: 0.1rem 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.2rem;
    font-size: 0.8rem;
    cursor: pointer;
}

.ac {
    width: fit-content;
    height: fit-content;
    flex: 0.9;
    margin: 2rem 1.2rem auto auto;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    gap: 2rem;
}

.count {
    height: fit-content;
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    align-items: center;
}

.cell {
    height: fit-content;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}

.cell h3 {
    font-size: 1.4rem;
}

.cell span {
    opacity: var(--text-opacity-4);
    font-size: 0.8rem;
}

.count hr {
    height: 1.5rem;
    opacity: 0.3;
}

.follow,
.msg {
    background: var(--app-theme-strong-background);
}

.act {
    display: flex;
    flex-direction: row;
    height: fit-content;
    gap: 1rem;
}

.banner {
    width: 95%;
    height:auto;
    display: flex;
    flex-direction: row;
    align-items: start;
    margin-top: 2rem;
}

.s-title {
    margin-bottom: 1rem;
}

.album {
    width: 25%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    word-wrap: break-word;
}

.songs {
    width: 76%;
    height: 90%;
}
.rows{
    height: 100%;
    width: 100%;
    margin-top: auto;
    margin-bottom: 0;
}
.album-display {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}

.album-display .latest-cover {
    width: 10.5rem;
    aspect-ratio: 1/1;
    border-radius: 0.5rem;
}

.album-display .latest-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    gap: 0.1rem;
    word-wrap: break-word;
}

.album-display .latest-time,
.latest-size {
    font-size: 0.9rem;
    font-weight: 400;
    opacity: var(--text-opacity-4);
}

.latest-name {
    font-weight: 500;
    font-size: 1.2rem;
    word-wrap: break-word;
}

.albums,
.mvs,
.intro,
.simi {
    height: fit-content;
    width: 95%;
    margin-bottom: 2rem;
}

.intro {
    padding: 0 2.5% 0 2.5%;
    background: var(--app-theme-component);
    margin-top: 1.6rem;
}

.intro .p-title {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.song::before{
    content: "";
    width: 100%;
    height: 1px;
    top: -0.5rem;
    position: absolute;
    background-color: var(--devide-color-l);
}
</style>