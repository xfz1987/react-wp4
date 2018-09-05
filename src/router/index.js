import React from 'react'
// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Layout from 'layout'
import Login from 'pages/login'
import Routes from './router.js'

import { getStorage } from 'util'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} 
      render={props => (
        getStorage('userInfo') ? <Component {...props} />
          : <Redirect to={{ pathname: '/login', state: { from: window.location.href } }} />
      )}
    />
  )
}

const Routers = (props) => {
  let LayoutRouter = (
    <Layout>
      <Switch>
        {
          Routes.map(({ type, path, exact, component, fromPath, toPath }, i) => (
            type === 'Route' 
              ? <PrivateRoute key={i} path={path} exact={exact} component={component} />
              : <Redirect key={i} from={fromPath} to={toPath} />
          ))
        }
      </Switch>
    </Layout>
  )

  return (
    <Router histroforceRefresh={!('pushState' in window.history)}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" render={props => LayoutRouter} />
      </Switch>
    </Router>
  )
}

export default Routers