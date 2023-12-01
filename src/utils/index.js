// 获取图片URL地址
export function getAssetsUrl(url, suffix = 'svg', folder = 'icons') {
  return new URL(`../assets/${folder}/${url}.${suffix}`, import.meta.url).href
}

// 过滤对象配置
export function filterConfig(config, filters) {
  const configObj = {}

  Object.keys(config).forEach((key) => {
    if (typeof filters == 'string') {
      if (key == filters) return
      configObj[key] = config[key]
    } else if (Array.isArray(filters)) {
      if (filters.includes(key)) return
      configObj[key] = config[key]
    }
  })

  return configObj
}

// 转换请求参数
export function withGinseng(params) {
  const paramsList = Object.entries(params).filter(
    ([_, value]) =>
      !((!value && value == null) || (!value && value == undefined))
  )

  const paramsString = `?${paramsList
    .map((item) =>
      item
        .map((jtem) => (typeof jtem == 'string' ? jtem.trim() : jtem))
        .join('=')
    )
    .join('&')}`

  return paramsString
}

// 格式化时间
export function formatTimer(cellValue, foramtType = 'yyyy-MM-dd HH:mm:ss') {
  if (!cellValue) return new Date()

  const date = new Date(cellValue)
  function procesWeek(weekNum) {
    weekNum = weekNum === 0 ? 7 : weekNum
    const WeekList = [
      { weekNum: 1, weekStr: '一' },
      { weekNum: 2, weekStr: '二' },
      { weekNum: 3, weekStr: '三' },
      { weekNum: 4, weekStr: '四' },
      { weekNum: 5, weekStr: '五' },
      { weekNum: 6, weekStr: '六' },
      { weekNum: 7, weekStr: '日' }
    ]
    const { weekStr } = WeekList.find((item) => item.weekNum === weekNum)
    return {
      weekNum,
      weekStr
    }
  }

  let dateTimer

  if (foramtType && foramtType.trim() != '') {
    dateTimer = foramtType
    const formatArray = [
      { rule: 'yyyy', value: timer['year'] },
      { rule: 'MM', value: timer['month'] },
      { rule: 'dd', value: timer['day'] },
      { rule: 'HH', value: timer['hours'] },
      { rule: 'mm', value: timer['minutes'] },
      { rule: 'ss', value: timer['seconds'] },
      { rule: 'W', value: timer['week'] }
    ]
    formatArray.forEach(({ rule, value }) => {
      dateTimer = dateTimer.replaceAll(rule, value)
    })
  } else {
    dateTimer = {
      year: `${date.getFullYear()}`,
      month: `${date.getMonth() + 1}`.padStart(2, '0'),
      day: `${date.getDate()}`.padStart(2, '0'),
      hours: `${date.getHours()}`.padStart(2, '0'),
      minutes: `${date.getMinutes()}`.padStart(2, '0'),
      seconds: `${date.getSeconds()}`.padStart(2, '0'),
      week: procesWeek(date.getDay()).weekStr,
      weekNum: procesWeek(date.getDay()).weekNum
    }
  }

  return dateTimer
}

export function beautify(styleing) {
  let styleString = Array.isArray(styleing) ? styleing[0] : styleing

  // 格式化样式字符串
  const rulesArray = styleString
    .split(';')
    .map((rule) => rule.trim())
    .filter((item) => {
      const [_, value] = item.split(':')
      if (value && value != '') return item
      return false
    })

  // 转换样式数据为对象
  const styleObject = rulesArray.reduce((acc, curr) => {
    const [property, value] = curr.split(':').map((part) => part.trim())
    // 小驼峰属性
    const camelCaseProperty = property.replace(/-([a-z])/g, (match, letter) =>
      letter.toUpperCase()
    )
    acc[camelCaseProperty] = value
    return acc
  }, {})

  return styleObject
}

export function downloadFile(path, name) {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
      if ('msSaveOrOpenBlob' in navigator) {
        navigator.msSaveOrOpenBlob(this.response, name)
        return
      }
      // const blob = new Blob([this.response], { type: xhr.getResponseHeader('Content-Type') });
      // const url = URL.createObjectURL(blob);
      const url = URL.createObjectURL(this.response)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
}
