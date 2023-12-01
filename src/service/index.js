import fetchRequest from './request'
import { BASE_URL, TIME_OUT } from './config'

export default new fetchRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})
