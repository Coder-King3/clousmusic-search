import request from '@/service'

export function getSearchMusic(params) {
  return request.get({
    url: '/search',
    params
  })
}
