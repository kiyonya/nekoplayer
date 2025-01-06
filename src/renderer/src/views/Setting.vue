<template>
  <div class="page">
    <div class="ctn">
      <h1 class="g-ti">常规设置</h1>
      <div class="set">
        <span>颜色模式：(自定义主题请在主题注册)</span>
        <select name="" id="" class="el-select" :value="appColormode" @change="this.$store.commit('changeUserTheme',$event.target.value)">
          <option value="follow">跟随系统</option>
          <option value="light">亮色</option>
          <option value="dark">暗色</option>
        </select>
      </div>
      <div class="set row">
        <span>字体选择</span>
        <select name="" id="" class="el-select" :value="appFont" @change="this.$store.commit('changeAppFont',$event.target.value)">
          <option value="">默认</option>
          <option
            :value="font.postscriptName"
            v-for="font in localFonts"
          >
            {{ font.fullName }}
          </option>
        </select>

        <button class="el-btn" @click="queryLocalFonts">刷新字体</button>
      </div>
      <div class="set row">
        <Checker :label="'开机自启动'"></Checker>
        <Checker :label="'使用GPU加速'"></Checker>
      </div>
    </div>

    <div class="ctn">
      <h1 class="g-ti">音频设置</h1>
      <div class="set">
        <span>音频质量</span>
        <select name="" id="" class="el-select" :value="audioQuality" @change="this.$store.commit('changeAudioQuality',$event.target.value)">
          <option value="standard">标准</option>
          <option value="higher">较高</option>
          <option value="exhigh">极高</option>
          <option value="lossless">无损</option>
          <option value="hires">Hi-Res</option>
          <option value="jyeffect">高清环绕声</option>
          <option value="sky">沉浸环绕声</option>
          <option value="jymaster">超清母带</option>
        </select>
      </div>

      <div class="set">
        <span>音频输出设备</span>
        <select name="" id="" class="el-select"></select>
      </div>

      <div class="set row">
        <Checker :label="'自动播放音频'"></Checker>
        <Checker :label="'退出保存音频进度'"></Checker>
        <Checker :label="'均衡音量'"></Checker>
        <Checker :label="'淡入淡出音频 '"></Checker>
      </div>
    </div>

    <div class="ctn">
      <h1 class="g-ti">个性化与相关推荐</h1>
      <div class="set row">
        <Checker :label="'使用cookies进行个性化推荐'"></Checker>
        <Checker :label="'展示相关推荐'"></Checker>
      </div>
    </div>

    <div class="ctn">
      <h1 class="g-ti">播放页设置</h1>

      <h2 class="g-ti-s">音频动效</h2>
      <div class="set row">
        <span>启用音频动效（较高占用）</span>
        <input type="checkbox" name="" id="" class="el-switch" />
      </div>
      <div class="set row">
        <div class="c-set">
          <span>音频动效渲染方式</span>
          <select name="" id="" class="el-select">
            <option value="normal">排列</option>
            <option value="high">随机</option>
          </select>
        </div>

        <div class="c-set">
          <span>动效均衡权重</span>
          <input type="range" name="" id="" v-model="audioEffectParams[0]"  max="1" min="0.1" step="0.01">
          <span>{{ audioEffectParams[0] }}</span>
        </div>

        <div class="c-set">
          <span>动效半径</span>
          <input type="range" name="" id="" v-model="audioEffectParams[1]" max="200" min="120" step="1"/>
          <span>{{ audioEffectParams[1]}}</span>
        </div>

        <div class="c-set">
          <span>动效样本数</span>
          <input type="range" name="" id="" v-model="audioEffectParams[2]" max="200" min="60" step="1"/>
          <span>{{ audioEffectParams[2] }}</span>
        </div>
      </div>

      <h2 class="g-ti-s">播放页背景</h2>
      <div class="set row">
        <div class="c-set">
          <span>背景模糊度</span>
          <input type="range" name="" id="" />
        </div>
      </div>
    </div>

    <div class="ctn">
      <h1 class="g-ti">歌词设置</h1>
      <div class="set row">
        <div class="c-set">
          <span>未播放歌词模糊显示</span>
          <select name="" id="" class="el-select">
            <option value="normal">启用</option>
            <option value="high">禁用</option>
          </select>
        </div>

        <div class="c-set">
          <span>歌词模糊度</span>
          <input type="range" name="" id="" />
        </div>
      </div>

      <div class="set">
        <span>显示翻译</span>
        <select name="" id="" class="el-select">
          <option value="normal">启用</option>
          <option value="high">禁用</option>
        </select>

        <span>罗马音</span>
        <select name="" id="" class="el-select">
          <option value="normal">显示罗马音</option>
          <option value="high">转化为平假名（测试）</option>
        </select>
      </div>
    </div>

    <div class="ctn">
      <h1 class="g-ti">代理</h1>
      <div class="set row">
        <span>代理协议</span>
        <select name="" id="" class="el-select">
          <option value="normal">禁用代理</option>
          <option value="high">http代理</option>
          <option value="high">https代理</option>
        </select>
      </div>

      <div class="set row" style="gap: 1rem">
        <span>代理地址</span>
        <input type="text" class="el-input" placeholder="代理服务器" />
        <span>代理端口</span>
        <input type="text" class="el-input" placeholder="代理端口" />
        <button class="el-btn">保存代理</button>
      </div>
    </div>

    <div class="ctn">
      <h1 class="g-ti">快捷键</h1>
      <div class="hotkey">
        <span class="s">功能</span>
        <span class="s">快捷键</span>
        <span class="s">全局快捷键</span>
        <span class="p">暂停/播放</span>
      </div>
    </div>
  </div>
</template>
<script>
import Checker from '@/components/Checker.vue'
import { store } from '@/store';
import { mapState } from 'vuex'
import Range from '@/components/Range.vue';
export default {
  computed: {
    ...mapState(['appColormode','appFont','audioQuality','audioEffectParams'])
  },
  components: {
    Checker,Range
  },
  data() {
    return {
      localFonts: []
    }
  },
  methods: {
    async queryLocalFonts() {
      const fonts = await window.queryLocalFonts()
      this.localFonts = fonts.filter((i) => {
        return this.containsChinese(i.fullName)
      })
    },
    containsChinese(str) {
      const chineseRegex = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      return chineseRegex.test(str)
    }
  },
  created() {
    this.queryLocalFonts()
  }
}
</script>
<style scoped>
.ctn {
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-bottom: 2rem;
  padding-top: 2rem;
  border-bottom: 1px solid var(--border);
}
.ctn:last-child {
  margin-bottom: 5rem;
}
.set {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: auto;
}
.set span {
  font-size: 1rem;
  font-weight: bold;
  transform: translateX(1px);
  opacity: var(--text-opacity-3);
}
.p {
  font-size: 1rem;
  font-weight: bold;
  transform: translateX(1px);
  opacity: var(--text-opacity-3);
}
.row {
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
span {
  display: block;
}
.c-set {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: fit-content;
  min-width: 10rem;
  height: 100%;
  justify-content: space-between;
}
.g-ti-s {
  font-size: 1.2rem;
  color: var(--app-theme-strong);
}
.g-ti {
  margin-top: 0 !important;
}
.el-btn {
  opacity: var(--text-opacity-3);
}
.hotkey {
  width: 60%;
  height: 20rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(8, 1fr);
}
.hotkey .s {
  font-size: 0.9rem;
  opacity: var(--text-opacity-4);
}
</style>
