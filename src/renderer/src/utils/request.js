/**
 * {path:xxx,params:{xxx:xxx},method:"post"}
 * {useCookie:true,timestamp:true}
 */

const host = "http://localhost:11451";
const cookie = localStorage.getItem("neko_user_cookie") || undefined;

/**
 * 
 * @param {object} req 请求参数
 * @param {object} opt 设置
 * @param {object} data 数据
 * @returns 
 */
export default async function request(req, opt = {}, data = {}) {
  const path = req.path || "";
  let useCookie = opt.useCookie || true;
  let useTimestamp = opt.useTimestamp || true;

  let extendParams = {};
  if (useTimestamp) {
    extendParams.timestamp = Date.now();
  }
  if (!useCookie) {
    extendParams.nocookie = true;
  }

  const params = useParams(req.params || {}, extendParams);
  const url = host + path + params;

  console.log(url);

  let requestBody = { ...data };
  if (useCookie) {
    requestBody.cookie = cookie;
  }

  let fetchOption = {
    method: req.method || "POST",
    headers: { ...(req.headers || {}), "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(url, fetchOption);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error("请求出错", error);
  }
}
/**
 *
 * @param {object} params
 * @param {object} extend
 */
function useParams(params, extend = {}) {
  params = { ...params, ...extend };
  let paramsString = new String();
  let i = 0;
  for (let key in params) {
    if (i == 0) {
      paramsString += `?${key}=${params[key]}`;
    } else {
      paramsString += `&${key}=${params[key]}`;
    }
    i++;
  }
  return paramsString;
}
