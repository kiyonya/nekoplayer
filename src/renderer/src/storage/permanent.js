
import { watch } from 'vue'
import { ref } from 'vue'
const permanent = {
  data: ref(114514),


  //播放页设置
  //是否允许播放页的动态效果
  enableDynamicAudioEffect:ref(true),
  //播放音频效果
  
}

const namespace = 'neko_'
const setWatch = () => {
  for (let key in permanent) {
    watch(permanent[key], (n, o) => {
        console.log("变化发生")
        console.log("存储在：",namespace + key.toString())
      localStorage.setItem(namespace + key.toString(), JSON.stringify(permanent[key].value))
    })
  }
}
const initStorage = () => {
  for (let key in permanent) {
    const storage = JSON.parse(localStorage.getItem(namespace + key.toString())) || permanent[key] || undefined
    permanent[key] = ref(storage)
  }
  console.log('读取完成', permanent)
  setWatch()
}
export { permanent, initStorage }
