import request from "@/utils/request.min";
export async function getQrKey(){
    const data = await request({
        url:`/login/qr/key?timestamp=${Date.now()}`,
    })
    return data
}

export async function verifyQr(key,noCookie = false) {
    const data = await request({
        url:`/login/qr/check?key=${key}&noCookie=${noCookie}`
    })
    return data
}


export async function checkQr(key) {
    const data = await request({
        url: `/login/qr/check?key=${key}&timestamp=${Date.now()}`
    })
    return data
}


export async function getLoginStatus(cookie) {
    const data = await request({
        url:`/login/status`,
        method:'post',
        body:{
            cookie
        }
    })
    return data
}



export async function getQrImg(key) {
    const data = await request({
        url:`/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`
        
    })
    return data
}

export async function getCaptcha(phone) {
    const data = await request({
        url:`/captcha/sent?phone=${phone}&timestamp=${Date.now()}`
    })
    return data
}

export async function verifyCaptcha(phone,captcha){
    const data = await request({
        url:`/captcha/verify?phone=${phone}&captcha=${captcha}&timestamp=${Date.now()}`,
    })
    return data
}

export async function saveCookie(cookie) {
    localStorage.setItem('neko_user_cookie',cookie)
}