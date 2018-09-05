import React from 'react'
import { Link } from 'react-router-dom'
import PageTitle from 'components/page-title'

const Error = (props) => {
  return (
    <div className="page-wrapper">
      <PageTitle title="出错啦!"/>
      <div className="row">
        <div className="col-md-12">
          <span>找不到该路径，</span>
          <Link to="/">点我返回首页</Link>
        </div>
      </div>
    </div>
  )
}

export default Error;