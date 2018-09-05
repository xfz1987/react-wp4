import React from 'react'
import ReactDOM from 'react-dom'
import Routers from './router'
import histroy from './history'

// window.AppHistory = histroy

class App extends React.Component {
  render() {
    return (
      <Routers />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

// 只有当开启了模块热替换时 module.hot 才存在
// if (module.hot) {
//   module.hot.accept(['./App'], () => {
//     render(<App />, document.getElementById('app'))
//   })
// }