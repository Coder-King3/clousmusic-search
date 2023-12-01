import { filterConfig } from '@/utils'
import CKPromise from '@/utils/CKPromise'

const CKFetch = async (...args) => {
  let [resource, config] = args
  const { interceptors = {}, timeout = 1000 * 60 } = config
  config = filterConfig(config, ['interceptors', 'timeout'])

  // request interceptor
  if (interceptors.request && typeof interceptors.request == 'function') {
    const requestConfig = interceptors.request({ ...config, url: resource })
    resource = requestConfig.url
    config = filterConfig(requestConfig, 'url')
  }

  // timeout controller
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  let response
  try {
    response = await fetch(resource, {
      ...config,
      signal: controller.signal
    })
  } catch (error) {
    return CKPromise.reject(response)
  }

  // failure interceptor
  if (!response.ok) {
    if (interceptors.failure && typeof interceptors.failure == 'function') {
      return interceptors.failure(response)
    } else {
      return CKPromise.reject(response)
    }
  }

  // response interceptor
  if (interceptors.response && typeof interceptors.response == 'function') {
    const json = () =>
      response
        .clone()
        .json()
        .then((res) => interceptors.response(res))
    response.json = json
  }

  clearTimeout(id)
  return response
}

export default CKFetch
