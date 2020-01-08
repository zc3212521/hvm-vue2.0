import Vue from 'vue'
import moment from 'moment'

// 本地时间转UTC时间
Vue.filter('localDate2utc', function (value) {
  return moment(value).utc().format()
})

// UTC时间转本地时间
Vue.filter('utc2localDate', function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(format)
})
