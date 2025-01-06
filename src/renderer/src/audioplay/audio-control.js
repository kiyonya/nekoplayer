import { play } from './player'
import { playlist, index, randomIndexHistory, playmode } from './player'
import temp from '@/store/temp'

const audio = temp.audio
/**
 * 下一首歌 step为步数 默认为1
 * @param {number} step
 */

const playmodeList = ['list', 'loop', 'random']

export function changePlaymode() {
  let currentModeIndex = playmodeList.indexOf(playmode.value)
  if (currentModeIndex + 1 < 3) {
    currentModeIndex += 1
  } else {
    currentModeIndex = 0
  }
  let newMode = playmodeList[currentModeIndex]
  playmode.value = newMode
  if (newMode == 'random') {
    if (randomIndexHistory.value.length <= 0) {
      randomIndexHistory.value.push(index.value)
    }
  } else {
    randomIndexHistory.value = []
  }
}

export function next(step = 1) {
  const max = playlist.value.length - 1
  if (playmode.value == 'random') {
    //首先 查看当前播放的歌曲指针是否在历史记录中 这里去掉了一个 因为末尾是不算数的
    let isInHistory = randomIndexHistory.value.slice(0, -1).includes(index.value)

    //如果在历史里且不是最后一个 那就播放下一个
    if (isInHistory) {
      //找到历史记录里对应指针的位置
      let pos = randomIndexHistory.value.indexOf(index.value)
      index.value = randomIndexHistory.value[pos + 1]
      play(playlist.value[index.value], true,false)
      return
    }
    //如果不在记录或者在最后一个 那就需要找到新的歌曲
    else {
      //找新歌曲前先要查看当前随机的已经满了
      let isFull = randomIndexHistory.value.length >= playlist.value.length
      //如果已经满了 清空重来
      if (isFull) {
        index.value = newRandomHistory()
        play(playlist.value[index.value], true,false)
        return
      }
      //如果没满，那就生成一个不属于之前的随机标签
      else {
        let randomIndex
        do {
          randomIndex = randInt(0, max)
        } while (randomIndexHistory.value.includes(randomIndex))
        index.value = randomIndex
        play(playlist.value[index.value], true,false)

        console.log(randomIndexHistory.value)
        return
      }
    }
  }
  if (index.value + 1 <= max) {
    index.value += step
  } else {
    index.value = 0
  }
  play(playlist.value[index.value], true,false)
}
/**
 * 上一首歌 step为步数 默认为1
 * @param {number} step
 */
export function previous(step = 1) {
  if (playmode.value == 'random') {
    //如果是随机 点击上一首 就先看历史记录是否存在 如果没有历史记录 那么就随机来一首
    let isHasHistory = randomIndexHistory.value.length !== 0
    //如果有历史 那么就从历史倒数第二个开始向前回溯
    if (isHasHistory) {
      //先找到当前的在历史的位置 一般开始是在最后
      let pos = randomIndexHistory.value.indexOf(index.value)
      console.log(pos)
      //位置不是最开始就上一一个
      if (pos > 0) {
        index.value = randomIndexHistory.value[pos - 1]
        play(playlist.value[index.value], true,false)
        return
      } else {
        //已经到最前面了 不做处理
        return
      }
    } else {
      //如果没有历史 那么创造历史
      index.value = newRandomHistory()
      play(playlist.value[index.value], true,false)
      return
    }
  }
  if (index.value - step >= 0) {
    index.value -= step
  } else {
    index.value = playlist.value.length - 1
  }
  play(playlist.value[index.value], true,false)
}
export function togglePlay() {
  if (audio.paused) {
    audio.play()
  } else {
    audio.pause()
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function newRandomHistory() {
  const max = playlist.value.length - 1
  randomIndexHistory.value = []
  return randInt(0, max)
}
