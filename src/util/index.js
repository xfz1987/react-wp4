// 工具方法

// 获取URL参数
export const getUrlParam = name => {
  let queryString = window.location.search.split('?')[1] || ''
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let result = queryString.match(reg)

  return result ? decodeURIComponent(result[2]) : null;
}

// 跳转登录
export const doLogin = () => window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)

// 成功提示
export const successTips = successMsg => alert(successMsg || '操作成功！')

// 失败提示
export const errorTips = errMsg => alert(errMsg || '好像哪里不对了~')

// 本地存储
export const setStorage = (name, data) => {
  let dataType = typeof data
  // json对象
  if (dataType === 'object') {
    window.localStorage.setItem(name, JSON.stringify(data));
  } else if (['number', 'string', 'boolean'].indexOf(dataType) >= 0) {
    // 基础类型
    window.localStorage.setItem(name, data)
  } else {
    // 其他不支持的类型
    alert('该类型不能用于本地存储');
  }
}

// 取出本地存储内容
export const getStorage = name => {
  let data = window.localStorage.getItem(name);
  return data ? JSON.parse(data) : ''
}

// 删除本地存储
export const removeStorage = name => window.localStorage.removeItem(name)

// 将对象转化为url参数拼接
export const objectToQuery = (object, encode = true) => {
  let ret = [];
  for (let key in object) {
    if (Array.isArray(object[key])) {
      ret.push(`${key}=${JSON.stringify(object[key])}`);
      continue;
    }

    ret.push(`${key}=${encode ? encodeURIComponent(object[key]) : object[key]}`);
  }

  return ret.join('&')
}

/**
 * http ajax请求
 * @param  {[type]} type       GET/POST
 * @param  {[type]} url        url
 * @param  {Object} para       数据
 * @param  {String} errMsg     如果错误信息，自己传一个
 * @param  {String} dataType   数据类型，默认为json
 * @param  {[type]} mask-false 请求前是否要loading
 */
export const http = (type, url, para = {}, errMsg = '请求失败,请稍后重试', successTip = false, dataType = 'json', mask = false) => {
  return new Promise((resolve, reject) => {
    // mask && waitstart
    if (!url) return false
    
    type = type.toLocaleUpperCase()
    
    let jsonData = objectToQuery(para);

    if (type === 'GET') {
      url = `${url}?${jsonData}`
    }

    let reqBody = {
      method: type,
      headers: type === 'GET' ? {} : { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    if (type === 'POST') {
      reqBody['body'] = jsonData 
    }

    fetch(url, reqBody)
      .then(res => {
        // mask && waitend
        return res.json()
      })
      .then(rs => {
        if (rs.status == 0) {
          resolve(rs.data || {})
          successTip && successTips(rs.msg)
        } else if (rs.status == 10) {
          // 没有登录状态，强制登录
          doLogin()
        } else {
          errorTips(rs.msg || errMsg)
          reject(rs)
        }
      })
      .catch(err => {
        // mask && waitend
        errorTips('请求失败,请稍后重试')
      })
  })
}
