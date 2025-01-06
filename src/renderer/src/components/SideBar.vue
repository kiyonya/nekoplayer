<template>
    <div class="side-bar" resize="true">

        <div class="router-group">
            <span class="router-link"><img src="@/assets/images/home.svg" alt="" class="i icon">{{ $t('sideBar.home') }}</span>
        </div>

        <div class="router-group">
            <div class="link-div">{{ $t('sideBar.discover') }}</div>
            <RouterLink class="router-link" to="/discover/recommend"  active-class="router-active"><img src="@/assets/images/recommend.svg" alt="" class="i icon">{{ $t('sideBar.recommend') }}</RouterLink>
            <RouterLink class="router-link" to="/discover/musicstyle/0" active-class="router-active"><img src="@/assets/images/music-style.svg" alt="" class="i icon">{{ $t('sideBar.musicStyle') }}</RouterLink>
            <RouterLink class="router-link" to="/listentogether" active-class="router-active"><img src="@/assets/images/music-style.svg" alt="" class="i icon">一起听</RouterLink>
        </div>
        <div class="router-group">
            <div class="link-div">{{ $t('sideBar.my') }}</div>
            <span class="router-link"><img src="@/assets/images/playlist.svg" alt="" class="i icon">{{ $t('sideBar.musicLibrary') }}</span>
            <span class="router-link"><img src="@/assets/images/history.svg" alt="" class="i icon">{{ $t('sideBar.history') }}</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    methods:{
        
    }
}
</script>

<style scoped>
.side-bar {
    width: var(--side-bar-width);
    height: calc(100% - 3.75rem - 4rem);
    top: 3.75rem;
    background-color: var(--app-theme);
    position: fixed;
    left: 0;
    z-index: 90;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    border-right: 1.5px solid var(--side-bar-border);
}
.i{
    width: 35%;
    aspect-ratio: 1/1;
    margin-bottom: 0.2rem;
}
.router-group:first-child{
    margin-top: 5rem;
}
.router-group{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
}
.link-div{
    margin-bottom: -0.3rem;
    font-size: 0.8rem;
    opacity: var(--text-opacity-4);
    width: 80%;
    text-align: center;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--side-bar-border);
}
.router-link{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.85rem;
    opacity: var(--text-opacity-2);
    width: 100%;
    text-decoration: none;
    color: var(--text-color);
    padding: 0.2rem 0 0.2rem 0;
    text-align: center;
    white-space: normal;
}
</style>