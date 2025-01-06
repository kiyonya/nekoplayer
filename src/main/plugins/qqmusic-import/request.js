const headers = {
  Referer: 'https://y.qq.com/portal/player.html',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
}
export async function getQQPlaylist(id) {
  const url = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=${id}&format=jsonp&g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0`

    const res = await fetch(url, {
      method: 'get',
      headers: headers
    })
    let data = await res.text()
    data = data.substring(13, data.length - 1)
    const jsonResponse = JSON.parse(data)
    console.log(jsonResponse)
    const processedData = await datahandler(jsonResponse)
    return processedData
}
async function datahandler(data) {
  const playlist = data.cdlist[0].songlist
  const res = []
  for (let song of playlist) {
    res.push({
      name: song.songname,
      orig: song.songorig,
      singer: song.singer,
      album: song.albumname
    })
  }
  return res
}
