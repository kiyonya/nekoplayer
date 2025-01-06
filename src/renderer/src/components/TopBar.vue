<template>
  <div class="top">
    <div class="electron-window">

    </div>
    <div class="top-bar">
      <div class="g1">
        <div class="router">
          <button @click="this.$router.back()" class="rg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="fa"
            >
              <path d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" />
            </svg>
          </button>
          <button @click="this.$router.forward()" class="rg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="fa"
            >
              <path d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
            </svg>
          </button>
        </div>

        <div class="search">
          <input type="text" placeholder="搜索内容" v-model="searchInput" />
          <img
            src="@/assets/images/search.svg"
            alt="喜欢"
            class="icon i"
            @click="
              console.log(searchInput);
              this.$router.push({
                name: 'Search',
                query: { key: this.searchInput },
              });
            "
          />
        </div>
      </div>

      <div class="nav">
        <RouterLink
          class="link"
          to="/recommend"
          active-class="router-active"
          >精选</RouterLink
        >
        <RouterLink
          class="link"
          :to="{ name: 'Discover', query: { cat: 'all', t: Date.now() } }"
          active-class="router-active"
          >发现</RouterLink
        >
        <RouterLink class="link" to="/library" active-class="router-active"
          >音乐库</RouterLink
        >
        <RouterLink
          class="link"
          to="/localmusic"
          active-class="router-active"
          >本地</RouterLink
        >
      </div>

      <div class="g2">
        <div class="user">
          <img
            :src="this.$user.profile.value.avatarUrl + '?param=50y50'"
            alt=""
            class="ava"
          />
          <span class="name"></span>
        </div>

        <div class="sys">

          <button class="el-btn" @click="this.$router.push({
            name:'Setting'
          })">设置</button>


          <svg
            t="1728306469380"
            class="icon i"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3695"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            v-if="appColormode !== 'dark'"
            @click="this.$store.commit('changeUserTheme','dark')"
          >
            <path
              d="M512 85.333333l10.709333 0.213334a12.288 12.288 0 0 1 9.429334 19.370666c-22.656 31.914667-36.48 53.76-41.514667 65.621334a277.333333 277.333333 0 0 0 350.250667 367.701333l11.776-4.522667c15.701333-6.528 35.370667-18.346667 59.008-35.498666A17.024 17.024 0 0 1 938.666667 512c0 9.6-0.298667 19.157333-0.938667 28.586667l-1.152 14.08-0.853333 7.68-1.706667 12.885333C903.466667 780.885333 726.144 938.666667 512 938.666667 276.352 938.666667 85.333333 747.648 85.333333 512c0-210.218667 152.064-384.938667 352.170667-420.181333l14.378667-2.261334 10.112-1.322666 7.338666-0.810667c14.037333-1.365333 28.245333-2.090667 42.666667-2.090667zM394.24 191.530667l-7.125333 2.688A341.461333 341.461333 0 0 0 512 853.333333a341.461333 341.461333 0 0 0 320.469333-223.616A362.666667 362.666667 0 0 1 394.24 191.530667z"
              fill="#000000"
              p-id="3696"
            ></path>
          </svg>
          <svg
            t="1728306487840"
            class="icon i"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3905"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            v-if="appColormode === 'dark'"
             @click="this.$store.commit('changeUserTheme','light')"
          >
            <path
              d="M512 853.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333334 0v-85.333333a42.666667 42.666667 0 0 1 42.666667-42.666667z m301.696-99.968l60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667 60.330667l-60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667-60.330667z m-543.061333 0a42.666667 42.666667 0 0 1 0 60.330667L210.346667 874.026667a42.666667 42.666667 0 1 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330666 0zM512 256a256 256 0 1 1 0 512 256 256 0 0 1 0-512z m0 85.333333a170.112 170.112 0 0 0-120.661333 50.005334A170.112 170.112 0 0 0 341.333333 512c0 47.146667 19.114667 89.813333 50.005334 120.661333A170.112 170.112 0 0 0 512 682.666667a170.112 170.112 0 0 0 120.661333-50.005334A170.112 170.112 0 0 0 682.666667 512a170.112 170.112 0 0 0-50.005334-120.661333A170.112 170.112 0 0 0 512 341.333333z m469.333333 128a42.666667 42.666667 0 0 1 0 85.333334h-85.333333a42.666667 42.666667 0 0 1 0-85.333334h85.333333zM128 469.333333a42.666667 42.666667 0 0 1 0 85.333334H42.666667a42.666667 42.666667 0 0 1 0-85.333334h85.333333z m746.026667-319.36a42.666667 42.666667 0 0 1 0 60.330667l-60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667 0z m-663.722667 0l60.330667 60.330667A42.666667 42.666667 0 0 1 210.346667 270.634667L149.973333 210.346667a42.666667 42.666667 0 1 1 60.330667-60.330667zM512 0a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333334 0V42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z"
              fill="#000000"
              p-id="3906"
            ></path>
          </svg>
          

          <hr>

          <svg xmlns="http://www.w3.org/2000/svg" class="fa i" viewBox="0 0 24 24" @click="electron_action('app:minimize')"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path  d="M2.5 12A1.5 1.5 0 0 1 4 10.5h16a1.5 1.5 0 0 1 0 3H4A1.5 1.5 0 0 1 2.5 12"/></svg>

          <svg xmlns="http://www.w3.org/2000/svg" class="fa i" viewBox="0 0 20 20" @click="electron_action('app:maximize')"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h9.5A2.25 2.25 0 0 1 17 5.25v9.5A2.25 2.25 0 0 1 14.75 17h-9.5A2.25 2.25 0 0 1 3 14.75zm2.25-.75a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-9.5a.75.75 0 0 0-.75-.75z"/></svg>

          <svg xmlns="http://www.w3.org/2000/svg" class="fa i" viewBox="0 0 24 24" @click="electron_action('app:close')"><g fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path  d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"/></g></svg>

          

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { profile } from "@/lib/auth";
import { currentTheme } from "@/utils/theme";
export default {
  data() {
    return {
      searchInput: "",
      ava: profile.value.avatarUrl,
      appColormode:currentTheme
    };
  },
  methods: {
    electron_action(event,value){
      window.electron.ipcRenderer.send(event,value || null)
    }
  },
  
};
</script>
<style scoped>
.top{
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  background: var(--app-theme);
  backdrop-filter: blur(10px) saturate(130%);
  z-index: 100;
}
.top-bar {
  --pad: 2.5%;
  width: calc(100% - 2 * var(--pad));
  padding: 0 var(--pad) 0 var(--pad);
  height: 3.75rem;
  padding-top: 0.7rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1;
  align-items: center;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.top-bar span,a,button,svg,img,input{
  -webkit-app-region: no-drag !important;
}
.i {
  height: 1.4rem;
  aspect-ratio: 1/1;
  opacity: 0.9;
}

.search {
  height: 50%;
  width: 15rem;
  background: var(--app-theme-component);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 0 0.5rem;
  border-radius: 5px;
  margin-left: 2rem;
}

.search .i {
  margin: auto 0 auto 1cqw;
}

.search:hover {
  filter: brightness(1.2);
}

.search input {
  outline: none;
  background: transparent;
  border: none;
  height: 85%;
  color: var(--text-color);
  font-size: 0.9rem;
  flex: 1;
}

.search:has(input:focus) {
  outline: #ffffff40 1px solid;
}

.user {
  width: fit-content;
  height: 50%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 1rem auto auto;
}

.user .ava {
  width: 1.8rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.user .name {
  font-size: 0.9rem;
  opacity: var(--text-opacity-2);
  margin-left: 0.5cqw;
}

.sys {
  height: 50%;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
  margin-right: 2.5%;
}
.sys hr {
  height: 60%;
  opacity: 0.2;
  background: var(--text-color);
}
.sys .i {
  height: 1.2rem;
  width: 1.2rem;
}
.router {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  margin-left: 2.5%;
}
.rg {
  width: fit-content;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border: none;
  background: none;
  border-radius: 20%;
}
.rg:hover {
  background-color: var(--hover);
}
.rg .fa {
  width: 1.3rem;
}
.nav {
  width: fit-content;
  display: flex;
  flex-direction: row;
  gap: 4rem;
  margin: auto;
  font-size: 1.2rem;
  font-weight: 600;
}
.router-active {
  color: var(--app-theme-strong);
}
.g1,
.g2 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
