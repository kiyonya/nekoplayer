import requests
id = '3602407677'
url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&disstid=" + id + "&format=jsonp&g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8¬ice=0&platform=yqq&needNewCode=0"
print(url)
headers = {
    "Referer":"https://y.qq.com/portal/player.html",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
}
res = requests.get(url=url,headers=headers)
print(res.text)