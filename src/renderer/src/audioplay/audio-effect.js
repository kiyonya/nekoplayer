/**
 * Audio.effect
 * Module Import
 * 感谢ps课上摸鱼的成果
 */
import { store } from "@/store";
import { computed, watch } from "vue";
let isinit = false;
const audioCtx = new AudioContext();
let source;
let analyser;
let outputGainNode;
let equalizer = computed(()=>{
  return store.state.equalizerData;
});

let useEQ = computed(() => {
  return store.state.config.enableEqualizer;
});

let dataArray = new Uint8Array(120).fill(0);
export async function initAudioCtx(sourceElement) {
  if (isinit) {
    return;
  }
  source = audioCtx.createMediaElementSource(sourceElement);
  outputGainNode = audioCtx.createGain()
  await initAudioNodes();

  isinit = true;
}
export async function initAudioNodes() {
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;

  //eq
  //创建10阶eq均衡器
  const bfs = [];
  for (let i = 0; i < equalizer.value.equalizerFrequency.length; i++) {
    const bf = audioCtx.createBiquadFilter();
    bf.Q.value = equalizer.value.equalizerQuality;
    bf.gain.value = parseInt(equalizer.value.equalizerGains[i]);
    bf.frequency.value = equalizer.value.equalizerFrequency[i];
    bf.type = "peaking";
    bfs.push(bf);
  }
  //链接滤波器组
  for (let i = 0; i < bfs.length - 1; i++) {
    bfs[i].connect(bfs[i + 1]);
  }

  const filterInput = bfs[0];
  const filterOutput = bfs[bfs.length - 1];

  watch(
    useEQ,
    () => {
      source.connect(analyser)
      source.connect(filterInput);
      filterOutput.connect(analyser);
      if (useEQ.value) {
        source.disconnect(analyser)
        source.connect(filterInput);
      } else {
        source.disconnect(filterInput)
        source.connect(analyser);
      }
    },
    { immediate: true }
  );

  dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.connect(outputGainNode)
  outputGainNode.connect(audioCtx.destination);

  let changeTimer = null;
  watch(equalizer, () => {
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => {
      for (let i = 0; i < bfs.length; i++) {
        const bf = bfs[i];
        bf.Q.value = equalizer.value.equalizerQuality;
        bf.gain.value = parseInt(equalizer.value.equalizerGains[i]);
        bf.frequency.value = equalizer.value.equalizerFrequency[i];
      }
    }, 100);
  });
}

export function renderData() {
  if (!isinit) {
    return new Uint8Array(256).fill(0);
  }
  analyser.getByteFrequencyData(dataArray);
  return dataArray;
}

export { dataArray };

export async function audioFade(from,to,time) {
  outputGainNode.gain.setValueCurveAtTime([from,to], audioCtx.currentTime + 0, time);
  setTimeout(() => {}, time);
}

