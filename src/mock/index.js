import { baseUrl } from '@/base/http'

let Mock = require('mockjs')

Mock.mock(`${baseUrl}/repos/octokit/octokit.rb`, 'get', {
  'name|1-10': '★',
  'git_url': '@url()'
})

console.log('hello')
