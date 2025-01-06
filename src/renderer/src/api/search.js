import request from "@/utils/request.min";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

export async function search(typeid,key,limit = 30,page = 1) {
    let offset = (page - 1) * limit
    const data = await request({
      url: `/search?keywords=${key}&type=${typeid}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`,
      method: "post",
      body: {
        cookie: cookie,
      },
    });
    return data;
  }