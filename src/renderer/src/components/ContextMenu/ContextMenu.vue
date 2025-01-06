<template>
  <div ref="contextMenuRef" class="fit">
    <slot></slot>
    <Teleport to="body" defer>
      <Transition>
        <div
          v-if="showMenu"
          class="context-menu"
          :style="{
            left: pos.posX + 'px',
            top: pos.posY + 'px'
          }"
        >
          <div class="menu-list" ref="list">
            <div
              class="menu-item"
              v-for="(item, i) in menu"
              :key="item.label"
              @click="handelClick(item)"
            >
              <span v-if="item.label">{{ item.label }}</span>
              <hr v-if="item == 'hr'">
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script setup>
import useContextMenu from '@/utils/useContextMenu'
import { computed, onMounted, ref } from 'vue'
import { useViewPort } from './useViewport'
const props = defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})
const contextMenuRef = ref(null)
const emit = defineEmits(['select'])
const { x, y,showMenu } = useContextMenu(contextMenuRef)
const { vw, vh } = useViewPort()
const list = ref(null)
const pos = computed(() => {
  if (list.value) {
    let w = list.value.clientWidth
    let h = list.value.clientHeight
    let posX = x.value
    let posY = y.value
    if (x.value > vw.value - w - 60) {
      posX = x.value - w
    }
    if (y.value > vh.value - h - 60) {
      posY = y.value - h
    }
    return {
      posX,
      posY
    }
  }
  else{
    return{posX:0,posY:0}
  }
})
function handelClick(item) {
  showMenu.value = false
  emit('select', item)
}
</script>
<style scoped>
.context-menu {
  position: fixed;
  background: var(--app-theme-component-op);
  box-shadow: 2px 2px 5px #14141461;
  min-width: 8rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  line-height: 1.8;
  white-space: nowarp;
  overflow: hidden;
  z-index: 9999;
  width: auto;
  height: auto;
  padding: 0.5rem;
}
.menu-list {
  display: flex;
  flex-direction: column;
}
.menu-item {
  padding: 0.1rem 0.4rem;
  border-radius: 0.2rem;
}
.menu-item:hover {
  background: var(--hover);
  font-weight: 600;
  color: var(--app-theme-strong);
}
.v-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.v-enter-to {
  opacity: 1;
  transition: 0.1s;
}
</style>
