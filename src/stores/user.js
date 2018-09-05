// user service
import { configure, observable, action, runInAction, computed } from 'mobx'
import { http, getStorage, setStorage, removeStorage } from 'util'

configure({ enforceActions: 'always' })

class UserStore {
  constructor() {
    this.getUserInfo()
  }

  @observable userInfo = {}

  @observable list = []

  @observable pageNum = 1

  @observable total = 0
  
  @computed
  get username() {
    return this.userInfo.username
  }
  
  @action getUserInfo = () => {
    this.userInfo = getStorage('userInfo')
  }

  @action checkLogin = (info) => {
    let { username, password } = info
    
    if (!username.length) {
      return {
        status: false,
        msg: '用户名不能为空！'
      }
    }
    
    if (!password) {
      return {
        status: false,
        msg: '密码不能为空！'
      }
    }
    
    return {
      status: true,
      msg: '验证通过'
    }
  }

  @action login = async (info, state, history) => {
    try {
      let data = await http('POST', '/manage/user/login.do', info, '用户名或密码错误')
      runInAction(() => {
        this.userInfo = data
        setStorage('userInfo', data)

        if (state && state.from) {
          history.replace(state.from)
        } else {
          history.replace('/')
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  @action logout = async (toPath) => {
    try {
      await http('POST', '/user/logout.do', {}, '退出登陆失败')
      runInAction(() => {
        removeStorage('userInfo')
        window.location.replace(toPath)
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  @action getUserList = async (pageNum = 1) => {
    this.pageNum = pageNum
    try {
      let data = await http('POST', '/manage/user/list.do', { pageNum }, '获取用户列表失败')
      runInAction(() => {
        this.list = data.list
        this.pageNum = data.pageNum
        this.total = data.total
      })
    } catch (err) {
      runInAction(() => {
        this.list = []
      })
    }
  }
}

export default new UserStore()