exports.install = function (Vue, options) {
  Vue.prototype.firstSpaceValidator = function (rule, value, callback) {
    try {
      if (value.startsWith(' ')) {
        callback(true) // eslint-disable-line
      }
      callback()
    } catch (err) {
      callback(err)
    }
  }
  /**
   * 判断字符串开关字符串
   * @param val 原字符串
   * @param str 比较用字符串
   * @returns {boolean}
   */
  Vue.prototype.startWith = function (val, str) {
    var reg = new RegExp('^' + str)
    return reg.test(val)
  }
}
