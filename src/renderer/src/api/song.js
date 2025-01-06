import request from '../utils/request.min.js'
const cookie = localStorage.getItem('neko_user_cookie') || undefined
export async function getSongDetial(id) {
  const data = await request({
    url: `/song/detail?ids=${id}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data
}

export async function getSongUrl(id, quality) {
  const data = await request({
    url: `/song/url/v1?id=${id}&level=${quality}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data.data[0].url
}

export async function checkMusicStatus(id) {
  const data = await request({
    url: `/check/music?id=${id}`
  })
  if (data.success) {
    return true
  }
  return false
}

export async function getSongChorus(id) {
  const data = await request({
    url: `/song/chorus?id=${id}`,
    method: 'post',
    body: {
      cookie: cookie
    }
  })
  return data.chorus[0]
}