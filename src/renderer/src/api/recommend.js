import request from "@/utils/request.min";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;
const radio = [
  3136952023, 5320167908, 5300458264, 5362359247, 5327906368, 5341776086,
];
async function getSimiSong(id) {
  const data = await request({
    url: `/simi/song?id=${id}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}
export async function getDailySong() {
  const data = await request({
    url: `/recommend/songs?timestamp=${Date.now()}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getRadio() {
  let res = [];
  for (let id of radio) {
    const upd = await request({
      url:`/playlist/update/playcount?id=${id}&timestamp=${Date.now()}`,
      method: "post",
      body: {
        cookie: cookie,
      },
    })
    const data = await request({
      url: `/playlist/detail?id=${id}&timestamp=${Date.now()}`,
      method: "post",
      body: {
        cookie: cookie,
        timestamp:Date.now()
      },
    });
    data.privileges = null;
    data.playlist.tracks = data.playlist.tracks.splice(0, 3);
    data.playlist.trackIds = [];
    res.push(data);
  }
  return res;
}
export async function getRecommendPlaylist() {
  
  const data = await request({
    url: `/personalized?limit=25&timestamp=${Date.now()}`,
    method: "post",
    body: {
      cookie: cookie + ';__remember_me=true;',
    },
  });
  
  return data;
  
}

export async function getNewAlbum(area) {
  const data = await request({
    url: `/album/new?limit=12&area=${area.toUpperCase()}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function personalFM(mode = "DEFAULT",submode = "") {
  const data = await request({
    url: `/personal/fm/mode?mode=${mode}&submode=${submode}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data
}

export async function  personalFMDislike() {
  
}