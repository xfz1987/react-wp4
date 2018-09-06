import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import PageTitle from 'components/page-title'
import statiStore from 'stores/statistic.js'
import './index.scss'

@observer
class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { userCount, productCount, orderCount } = statiStore.homeCount
    return (
      <div className="page-wrapper">
        <PageTitle title="首页" />
        <div className="row">
          <div className="col-md-4">
            <Link to="/user" className="color-box brown">
              <p className="count">{userCount}</p>
              <p className="desc">
                <i className="fa fa-user-o"></i>
                <span>用户总数</span>
              </p>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/product" className="color-box green">
              <p className="count">{productCount}</p>
              <p className="desc">
                <i className="fa fa-user-o"></i>
                <span>商品总数</span>
              </p>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/order" className="color-box blue">
              <p className="count">{orderCount}</p>
              <p className="desc">
                <i className="fa fa-user-o"></i>
                <span>订单总数</span>
              </p>
            </Link>
          </div>
        </div>
        <img className="home-logo" src={require('../../images/black-bg.jpg')} />
        <i className="test-icon"></i>
        <em className="home-logo test-icon2"></em>
      </div>
    )
  }
}

export default Home