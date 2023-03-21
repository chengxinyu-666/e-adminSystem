import Cookies from 'js-cookie'
import website from "../config/website";
const TokenKey = 'x-access-token'
var inFifteenMinutes = new Date(new Date().getTime() +  2000)+"";
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token, { "max-age": inFifteenMinutes })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function headers(){
  const aut = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  var headers = {
    Authorization:aut,
  };
  if (getToken()) {
    headers['Blade-Auth'] =  'bearer ' + getToken()// 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  console.log(headers)
  return headers
}
