import React from 'react'
import { Provider } from 'mobx-react'
import NavTop from 'components/nav-top'
import NavSide from 'components/nav-side'
import userStore from 'stores/user.js'

import './index.scss'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider userStore={userStore}>
        <div className="wrapper">
          <NavTop />
          <NavSide />
          {this.props.children}
        </div>
      </Provider>
    )
  }
}