/**
 * 解析url参数
 * @example ？id=123&a=456
 * @return Object {id:123, a:456}
*/

export function urlParse () {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // ['id'=123, 'a'=b]
  if (arr) {
    arr.forEach((item) => {
      let temArr = item.substring(1).split('=')
      let key = decodeURIComponent(temArr[0])
      let val = decodeURIComponent(temArr[1])
      obj[key] = val
    })
  }
  return obj
}
