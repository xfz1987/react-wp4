import React from 'react'
import { observer } from 'mobx-react'
import { errorTips } from 'util'
import UserStore from 'stores/user.js'

import './index.scss'

@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  UNSAFE_componentWillMount() {
    document.title = '登录 - MMALL ADMIN';
  }

  componentDidMount() {
    console.log(UserStore) 
  }

  onInputChange(e) {
    let inputValue = e.target.value
    let inputName = e.target.name

    this.setState({
      [inputName]: inputValue
    })
  }

  onInputKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSubmit()
    }
  }

  async onSubmit() {
    let { username, password } = this.state
    let loginInfo = { username, password }

    let checkResult = UserStore.checkLogin(loginInfo)

    if (checkResult.status) {
      await UserStore.login(loginInfo, this.props.location.state, this.props.history)
    } else {
      errorTips(checkResult.msg);
    }          
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-4">
        <div className="panel panel-default login-panel">
          <div className="panel-heading">欢迎登录 - MMALL管理系统</div>
          <div className="panel-body">
            <div>
              <div className="form-group">
                <input 
                  type="text"
                  name="username" 
                  className="form-control" 
                  placeholder="请输入用户名" 
                  onKeyUp={e => this.onInputKeyUp(e)}
                  onChange={e => this.onInputChange(e)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password" 
                  name="password"
                  className="form-control" 
                  placeholder="请输入密码" 
                  onKeyUp={e => this.onInputKeyUp(e)}
                  onChange={e => this.onInputChange(e)}
                />
              </div>
              <button className="btn btn-lg btn-primary btn-block" onClick={() => this.onSubmit()}>登录</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
