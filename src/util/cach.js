const LIST_KEY = '__list_key_';
const THEME_KEY = '__theme_key_';
const TOKEN_KEY = '__token_key_';
const CODE_KEY = '__code_key_';
const URL_KEY = '__url_key_';
const CURRENT_DATA_KEY = '__current_data_key_';
const LOTTERY_DATA_KEY = '__lottery_data_key_';
const IS_APP_KEY = '__is_app__';

export function getIsApp() {
    return sessionStorage.getItem(IS_APP_KEY);
}
export function setIsApp(isApp) {
    return sessionStorage.setItem(IS_APP_KEY, isApp || '');
}

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
    return sessionStorage.setItem(TOKEN_KEY, token || '');
}
export function getUrl() {
    return sessionStorage.getItem(URL_KEY);
}
export function setUrl(url) {
    return sessionStorage.setItem(URL_KEY, url);
}

export function getSiteCode() {
    return sessionStorage.getItem(CODE_KEY);
}
export function setSiteCode(token) {
    return sessionStorage.setItem(CODE_KEY, token);
}

export function getLotteryList() {
    return JSON.parse(sessionStorage.getItem(LIST_KEY));
}
export function setLotteryList(list) {
    sessionStorage.setItem(LIST_KEY, JSON.stringify(list));
}
export function getLotteryData(key) {
    return JSON.parse(sessionStorage.getItem(LOTTERY_DATA_KEY + key));
}
export function setLotteryData(key, val) {
    sessionStorage.setItem(LOTTERY_DATA_KEY + key, JSON.stringify(val));
}
export function getCurrentLottery() {
    return JSON.parse(sessionStorage.getItem(CURRENT_DATA_KEY));
}
export function setCurrentLottery(val) {
    sessionStorage.setItem(CURRENT_DATA_KEY, JSON.stringify(val || null));
}
export function setTheme(val) {
    localStorage.setItem(THEME_KEY, val);
}
export function getTheme() {
    return localStorage.getItem(THEME_KEY) || '54b1ff';
}
