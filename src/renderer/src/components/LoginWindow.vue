<template>
    <div class="login-window" open>
        <div class="login-title">
            <h4>{{ $t('loginWindow.title') }}</h4>
            <p>{{ $t('loginWindow.subtitle') }}</p>
        </div>
        <div class="login-shell">
            <div class="login-as-qr">
                <img :src="qrSrc" alt="" :class="qrs">
                <div class="qr-mask"></div>
                <p class="tip">{{ !qrTip ? this.$t('loginWindow.loginAsQr') : qrTip }}</p>
            </div>
            <div class="_div"></div>
            <div class="login-as-phone">
                <div class="login-phone-shell">
                    <div class="tip">{{ $t('loginWindow.loginAsPhone') }}</div>
                    <div class="_phone _widget">
                        <span class="phone_area_code">+86</span>
                        <input type="text" :placeholder="this.$t('loginWindow.cellphone')" maxlength="11" v-model="phone">
                    </div>
                    <div class="_vrf _widget">
                        <input type="text" maxlength="4" v-model="captcha">
                        <button @click="getcaptchaCode()" :disabled="captchaDisable">{{ captchaText ? captchaText : this.$t('loginWindow.captcha')
                            }}</button>
                    </div>
                    <button class="login-btn _widget" @click="loginAsPhone">{{ $t('loginWindow.login') }}</button>
                </div>
            </div>
        </div>
        <p class="promise">{{ $t('loginWindow.promise') }}</p>
    </div>
</template>
<script>
import * as login from '../api/login'
import { store } from '@/store';
export default {
    data() {
        return {
            captchaText: "",
            captchaDisable: false,
            phone: undefined,
            captcha: undefined,
            qrSrc: "@/assets/images/qrcode.svg",
            qrs: 'qrcode ',
            qrTip: "",
        }
    },
    methods: {
        async QR() {
            this.qrs = 'qrcode '
            this.qrTip = ""
            let key = await login.getQrKey()
            let qrData = await login.getQrImg(key.data.unikey)
            this.qrSrc = qrData.data.qrimg
            let qrCheckTimer = setInterval(async () => {
                const qrStatus = await login.checkQr(key.data.unikey)
                if (qrStatus.code === 800) {
                    this.qrTip = this.$t('loginWindow.qrTimeout')
                    clearInterval(qrCheckTimer)
                    this.QR()
                }
                else if (qrStatus.code === 802) {
                    this.qrs = 'qrcode qrcodeScred'
                    this.qrTip = this.$t('loginWindow.qrWaiting')
                }
                else if (qrStatus.code === 803) {
                    clearInterval(qrCheckTimer)
                    this.qrTip = this.$t('loginWindow.qrSuccess')
                    await login.getLoginStatus(qrStatus.cookie)
                    console.log(qrStatus.cookie)
                    login.saveCookie(qrStatus.cookie)
                    this.loginOK()
                }
            }, 3000);
        },
        async getcaptchaCode() {
            const captcha = await login.getCaptcha(this.phone)
            console.log(captcha)
            if (!captcha.data) {
                this.captchaText = this.$t('loginWindow.captchaError')
                return
            }
            if (this.phone.length < 11) {
                return
            }
            else {
                this.captchaDisable = true
                let second = 60
                this.captchaText = `60s`
                let timer = setInterval(() => {
                    second--
                    this.captchaText = `${second}s`
                    if (second <= 0) {
                        this.captchaDisable = false
                        this.captchaText = this.$t('loginWindow.captcha'),
                            clearInterval(timer)
                    }
                }, 1000)
            }
        },
        async loginAsPhone() {
            if (!this.captcha || this.phone.length < 11) { return }
            const data = await login.verifyCaptcha(this.phone, this.captcha)
            if (data.data) {
                this.loginOK()
            }
        },
        loginOK() {
            store.commit('updateLoginStatus',true)
            location.reload()
        }
    },
    mounted() {
        this.QR()
    },

}
</script>
<style scoped>
.login-window {
    width: 28rem;
    height: 16rem;
    background: var(--app-theme);
    position: absolute;
    z-index: 10000;
    left: calc(50% - 15rem);
    top: calc(50% - 9rem);
    box-shadow: 2px 2px 3px #00000013;
    border-radius: 10px;
    border: 1px solid #30303030;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

._div {
    width: 1px;
    height: 85%;
    background: #0000001c;

}

.login-title {
    display: flex;
    flex-direction: column;
}

.login-title h4 {
    font-size: 1.2rem;
    opacity: 0.75;
}

.login-title p {
    font-size: 0.58rem;
    opacity: 0.6;
}

.promise {
    font-size: 0.6rem;
    opacity: 0.6;
    margin: auto auto 0px auto;
}

.login-shell {
    width: 100%;
    height: 60%;
    background: var(--app-theme-darker);
    margin: auto;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.login-shell .login-as-qr {
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.login-shell .tip {
    font-size: 0.7rem;
    font-weight: 600;
    opacity: 0.6;
}

.login-shell .login-as-qr .qrcode {
    width: 70%;
    position: relative;
}

.login-shell .login-as-qr .qrcode::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    top: 0;
    left: 0;
    z-index: 120;
}

.qrcodeScred {
    opacity: 0.2;
}

.login-as-phone {
    flex: 1;
    height: 100%;
    display: flex;
}

.login-as-phone .login-phone-shell {
    width: 80%;
    height: fit-content;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.login-as-phone .login-phone-shell input {
    border: none;
    outline: none;
    appearance: none;
    background: transparent;
}

.login-as-phone .login-phone-shell ._widget {
    display: flex;
    align-items: center;
    border-radius: 4px;
    background: var(--app-theme-widget);
    height: 1.7rem;
    flex-shrink: 0;
}

.login-as-phone .login-phone-shell ._phone {
    width: 100%;
}

.login-as-phone .login-phone-shell ._phone .phone_area_code {
    font-size: 0.7rem;
    margin: auto 8px auto 10px;
    padding: 0px 10px 0px 0px;
    border-right: 1px solid #00000036;
    color: var(--app-theme-strong);
}

.login-as-phone .login-phone-shell ._phone input {
    flex: 1;
    font-size: 0.7rem;
}

.login-as-phone .login-phone-shell ._vrf {
    display: flex;
    flex-direction: row;
}

.login-as-phone .login-phone-shell ._vrf input {
    margin-left: 10px;
    width: 60%;
    font-size: 0.7rem;
}

.login-as-phone .login-phone-shell ._vrf button {
    background: transparent;
    border: none;
    font-size: 0.6rem;
    margin: auto 10px auto auto;
    padding: 0px 0px 0 10px;
    border-left: 1px solid #00000036;
    opacity: 0.6;
    width: 4rem;
}

.login-as-phone .login-phone-shell .login-btn {
    width: 100%;
    background: var(--app-theme-strong-background);
    border: none;
    display: block;
    color: var(--app-theme-strong);
    font-size: 0.7rem;
    font-weight: bold;
}
</style>