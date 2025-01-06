<template>
    <div class="top">
        <div class="cover">
            <img :src="cover + `?parma=500y500`" alt="" class="main" />
            <img :src="cover + `?parma=500y500`" alt="" class="blur" />
        </div>
        <div class="detial">
            <h2 class="name">{{ name }}</h2>
            <span class="subtitle" v-if="subtitle" @click="this.$emit('subtitleclick',true)">{{ subtitle}}</span>
            <div class="maininfo" v-if="maininfo">
                <span>{{ maininfo }}</span>
            </div>
            <div class="maininfo " v-if="creator">
                <span @click="oncreatorclick">由{{ creator }}创建</span>
            </div>
            <div class="info">
                <span>{{ info }}</span>
            </div>
            <div class="desc" v-if="desc" @click="this.$emit('descClick',true)">{{ desc }}</div>
            <div class="btns">
                <button @click="this.$emit('playall',true)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="i">
                        <path fill-rule="evenodd"
                            d="M19.5 14.598c2-1.155 2-4.041 0-5.196l-9-5.196C8.5 3.05 6 4.494 6 6.804v10.392c0 2.31 2.5 3.753 4.5 2.598z"
                            clip-rule="evenodd" />
                    </svg>播放
                </button>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fa i">
                        <path
                            d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675t1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025t2.45 2.675T12 18.3m0-6.825" />
                    </svg>
                </button>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fa i">
                        <circle cx="12" cy="12" r="1.75" />
                        <circle cx="19" cy="12" r="1.75" />
                        <circle cx="5" cy="12" r="1.75" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["cover","name","subtitle","maininfo","info","desc","onplayall","onsubtitleclick","oncreatorclick","creator"]
}
</script>
<style scoped>
.top {
    position: relative;
    margin-top: 3rem;
    margin-bottom: 1.8rem;
    width: 93%;
    height: 18rem;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.cover {
    height: 100%;
    aspect-ratio: 1/1;
    position: relative;
    display: flex;
    justify-content: center;
}

.cover .main {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5%;
}

.cover .blur {
    width: 95%;
    aspect-ratio: 1/1;
    position: absolute;
    border-radius: 5%;
    z-index: -1;
    filter: blur(15px);
    bottom: -1rem;
    opacity: 0.5;
}

.detial {
    position: relative;
    width: 50%;
    height: 100%;
    margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
    color: var(--text-color);
    flex: 1;
}

.detial .name {
    margin-top: 0rem;
    font-size: 2.3rem;
}
.detial .subtitle {
    margin-top: 0.3rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--app-theme-strong);
}
.detial .maininfo {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.8rem;
    font-size: 1.3rem;
    font-weight: 400;
    opacity: var(--text-opacity-1);
}



.detial .info {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    font-size: 1rem;
    opacity: var(--text-opacity-4);
}

.detial .tags {
    display: flex;
    flex-direction: row;
    gap: 0.9rem;
    font-size: 1rem;
}

.detial .tags span {
    background: var(--app-theme-component);
    padding: 0.1rem 0.5rem;
    border-radius: 1rem;
}

.desc {
    width: 70%;
    height: fit-content;
    display: -webkit-inline-box;
    margin: auto auto auto 0px;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis;
    opacity: var(--text-opacity-4);
    font-size: 0.9rem;
}
.desc:hover{
    text-decoration: underline;
}
.btns {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    margin: auto auto 0px 0px;
    width: 100%;
    height: 2.5rem;
}

.btns button {
    height: 100%;
    aspect-ratio: 1/1;
    border: none;
    background: var(--app-theme-component);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    border-radius: 5px;
    color: var(--text-color);
    font-size: 1.2rem;
    gap: 0.2rem;
    box-shadow: 1px 2px 5px #00000015;
}

.btns button:first-child {
    padding: 0.4rem 1rem;
    aspect-ratio: auto;
    background: var(--app-theme-strong-background);
    font-weight: 600;
    color: white;
    fill: white;
}

.btns button .i {
    height: 1.5rem;
    aspect-ratio: 1/1;
}
</style>