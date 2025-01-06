import request from "@/utils/request.min";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;
export async function getPlaylistDetial(pid) {
  const data = await request({
    url: `/playlist/detail?id=${pid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}

export async function getPlaylistMusic(pid, count, page) {
  const limit = 15;
  const maxPage = Math.ceil(count / limit);
  if (page <= 0) {
    page = 0;
  }
  if (page >= maxPage) {
    page = maxPage;
  }
  const offset = limit * (page - 1);
  const data = await request({
    url: `/playlist/track/all?id=${pid}&limit=${1000}&offset=${0}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data
}

export async function getRelatedPlaylist(pid) {
  const data = await request({
    url: `/related/playlist?id=${pid}`,
    method: "post",
    body: {
      cookie: cookie,
    },
  });
  return data;
}