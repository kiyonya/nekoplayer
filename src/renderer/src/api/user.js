import request from "@/utils/request.min";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function getUserPlaylist(uid) {

  const data = await request({
    url: `/user/playlist?uid=${uid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  const playlist = {
    create:[],
    collect:[],
  }
  for(let p of data.playlist){
    if(p.creator.userId == uid){
       playlist.create.push(p) 
    }
    else{
        playlist.collect.push(p)
    }
  }
  return playlist;
}

export async function getUserCollectedAlbums() {
  const data = await request({
    url: `/album/sublist`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data
}

export async function getUserCollectedMV() {
  const data = await request({
    url: `/mv/sublist`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data
}