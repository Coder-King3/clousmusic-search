import { filterConfig, withGinseng } from '@/utils'
import CKFetch from '@/utils/CKFetch'
import CKPromise from '@/utils/CKPromise'

class fetchRequest {
  constructor(config) {
    this.service = {
      config: config,
      request: CKFetch
    }
  }

  request(config) {
    const requestUrl = `${this.service.config.baseURL || ''}${config.url}`
    const requestConfig = {
      ...filterConfig(this.service.config, 'baseURL'),
      ...filterConfig(config, 'url')
    }
    return new CKPromise(async (resolve, reject) => {
      const fetchResult = await this.service.request(requestUrl, requestConfig)

      fetchResult
        .json()
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get(config) {
    if (config.params && Object.keys(config.params).length > 0) {
      config.url += withGinseng(config.params)
      config = filterConfig(config, 'params')
    }

    return this.request({ ...config, method: 'GET' })
  }
  post(config) {
    return this.request({ ...config, method: 'POST' })
  }
  delete(config) {
    return this.request({ ...config, method: 'DELETE' })
  }
  patch(config) {
    return this.request({ ...config, method: 'PATCH' })
  }
  put(config) {
    return this.request({ ...config, method: 'PUT' })
  }
}

export default fetchRequest
