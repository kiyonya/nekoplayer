import { getLoginStatus } from "@/api/login";
import { ref } from "vue";
import { store } from "@/store";

const account = ref({});
const profile = ref({});
export { profile };
export async function login() {
  const cookie = localStorage.getItem("neko_user_cookie");
  if (!cookie) {
    store.commit("updateLoginStatus",false)
  } else {
    let loginStatus = await getLoginStatus(cookie);
    if (loginStatus.data.account.status < 0) {
      store.commit("updateLoginStatus",false)
    } else {
      console.log(loginStatus);
      store.commit("updateLoginStatus",true)
      account.value = loginStatus.data.account;
      profile.value = loginStatus.data.profile;
    }
  }
}
