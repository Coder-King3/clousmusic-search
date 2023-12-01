import request from '@/service'

export function getSongUrl(params) {
  return request.get({
    url: '/song/url',
    params
  })
}

export function getSongDetail(params) {
  return request.get({
    url: '/song/detail',
    params
  })
}
