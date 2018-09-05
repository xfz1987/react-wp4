
import React from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

@inject('userStore')
@observer
class NavTop extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    let { username, logout } = this.props.userStore

    return (
      <div className="navbar navbar-default top-navbar">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/"><b>HAPPY</b>MMALL</Link>
        </div>
        <ul className="nav navbar-top-links navbar-right">
          <li className="dropdown">
            <a className="dropdown-toggle" href="javascript:;">
              <i className="fa fa-user fa-fw"></i>
              {
                username
                  ? <span>欢迎，{username}</span>
                  : <span>欢迎您</span>
              }
              <i className="fa fa-caret-down"></i>
            </a>
            <ul className="dropdown-menu dropdown-user">
              <li>
                <a onClick={() => logout('/login')}>
                  <i className="fa fa-sign-out fa-fw"></i>
                  <span>退出登录</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default NavTop;