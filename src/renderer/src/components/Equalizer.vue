<template>
  <div class="mask">
    <div class="equalizer">
      <div class="head">
        <h2 class="ti">图形均衡器</h2>
        <input
          type="checkbox"
          name=""
          id=""
          class="el-switch"
          ref="toggle"
          @change="
            this.$store.commit('toggleEqualizer', this.$refs.toggle.checked)
          "
          :checked="enableEqualizer"
        />
        <button
          class="close"
          @click.stop="this.$store.commit('toggleEqulizerWindow')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="fa"
          >
            <path
              d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
            />
          </svg>
        </button>
      </div>
      <div class="preset" :class="enableEqualizer ? '' : 'disable'">
        <span class="tag">预设均衡器</span>
        <select name="" id="" class="section" @change="()=>{const value = (this.$refs.preset.value.split(',')).map(i=>{return parseInt(i)});this.$store.commit('updateEqulizerGains',value)}" ref="preset" >
          <option :value="preset.value" v-for="preset in equalizer.equalizerPreset">{{ preset.name }}</option>
        </select>
        <button class="el-btn" @click="this.$store.commit('updateEqualizerCustomPreset')">保存到自定义</button>
      </div>

      <div class="action" :class="enableEqualizer ? '' : 'disable'">
        <div class="eq-scale">
          <span class="tag">+12dB</span>
          <span class="tag">0dB</span>
          <span class="tag">-12dB</span>
        </div>
        <div
          class="eq-shell"
          v-for="(f, index) in equalizer.equalizerFrequency"
        >
          <span class="gain tag">{{ equalizer.equalizerGains[index] }}</span>
          <input
            type="range"
            name=""
            id=""
            max="12"
            min="-12"
            step1
            class="eq-input"
            v-model="equalizer.equalizerGains[index]"
          />
          <span class="frequency tag"
            >{{ f < 1000 ? f : Math.round(f / 1000) + "k" }}Hz
          </span>
        </div>
      </div>
      <div class="eq-setting" :class="enableEqualizer ? '' : 'disable'">
        <span class="tag">质量因子</span>
        <input
          type="range"
          name=""
          id=""
          max="5"
          min="1"
          step="0.1"
          v-model="equalizer.equalizerQuality"
          class="v-input"
        />
        <span class="tag">{{ equalizer.equalizerQuality }}</span>

        <button class="el-btn" @click="this.$store.commit('resetEqualizer')">
          重置
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["equalizer", "enableEqualizer"]),
  },
};
</script>
<style scoped>
.equalizer {
  position: absolute;
  z-index: 9999;
  width: 40rem;
  height: 24rem;
  background-color: var(--app-theme-component);
  left: calc(50% - 20rem - 2rem);
  top: calc(50% - 12rem - 2rem);
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  align-items: center;
  gap: 1.5rem;

  box-shadow: 2px 4px 10px #1a1a1a3a;
}
.action {
  width: 100%;
  height: 70%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: 1fr;
}
.eq-shell {
  min-width: 3.5rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
  transition:  .2s ease-in-out;
}
.eq-shell:hover{
  background: var(--hover);

}
.eq-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: auto;
  text-align: right;
  margin-right: 0.7rem;
}
.eq-shell span {
  opacity: var(--text-opacity-2);
}
.eq-input {
  width: 5px;
  flex: 1;
  -webkit-appearance: slider-vertical;
  writing-mode: vertical-lr;
  direction: rtl;
}

.head {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-bottom: 0.7rem;
  border-bottom: var(--border) 1px solid;
}
.head .ti {
  font-size: 1.5rem;
  opacity: var(--text-opacity-2);
}
.head .el-switch {
  margin-left: 1rem;
}
.close {
  width: fit-content;
  height: fit-content;
  background: none;
  border: none;
  margin: auto 0 0 auto;
}
.close .fa {
  width: 2.1rem;
}
.tag {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: var(--text-opacity-2);
}
.preset {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}
.preset option{
  background: var(--app-theme-component);
}
.section {
  width: fit-content;
  height: 2rem;
  font-size: 1.1rem;
  background: none;
  border: 2px solid var(--border);
  border-radius: 2rem;
  padding: 0 0.5rem;
  color: var(--text-color);
  outline: none;
}

.disable {
  pointer-events: none;
}
.disable * {
  filter: brightness(0.8);
}
.eq-setting {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
.eq-setting .el-btn {
  font-weight: 600;
  color: rgb(238, 87, 87);
  margin-left: auto;
  margin-right: 0;
}
.v-input {
  height: 5px;
  width: 20%;
}
</style>
