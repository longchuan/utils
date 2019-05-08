const formatStringTime = (date, onlyYear) => {
  if (!isString(date)) return 0;
  date = date.replace(/-/g, '/');
  date = new Date(date);
  return formatDateTime(date, onlyYear);
}
const formatDateTime = (date, onlyYear) => {
  if (!isDate(date)) return 0;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  var yearStr = [year, month, day].map(formatNumber).join('-');
  if (onlyYear) {
    return yearStr;
  } else {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return yearStr + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}
function getLocalTime(date, onlyYear) {
  date = new Date(parseInt(date) * 1000);
  return formatDateTime(date, onlyYear);
}
function getLocalRawTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
const isInteger = obj => {
  return typeof obj === 'number' && obj % 1 === 0
}
const isString = obj => {
  return typeof obj === 'string' && obj.constructor == String;
}
const isDate = obj => {
  return typeof obj === 'object' && obj.constructor == Date;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const changeTime = e => {
  var t = "";
  if (e instanceof String)
    var a = Date.parse(new Date()) / 1000 - e / 1000;
  else a = e;
  if (a > 259200) {
    var n = new Date(e);
    return formatDateTime(n,!0);
  } else t = a > 172800 && a < 259200 ? "前天" : a > 86400 && a < 172800 ? "昨天" : a > 3600 && a < 86400 ? Math.floor(a / 3600) + "小时前" : a > 60 && a < 3600 ? Math.floor(a / 60) + "分钟前" : "刚刚";
  return t;
}
module.exports = {
  changeTime: changeTime,
  formatStringTime: formatStringTime,
  getLocalTime: getLocalTime,
  getLocalRawTime: getLocalRawTime,
}