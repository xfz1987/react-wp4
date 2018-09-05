import React from 'react' 
import TopBarProgress from 'react-topbar-progress-indicator'

TopBarProgress.config({
  barColors: {
    '0': '#2DAFCB',
    '1.0': '#2DAFCB'
  },
  barThickness: 1,
  shadowBlur: 0
})

export default (loadComponent) => {
  return class AsyncComponent extends React.Component {
    constructor () {
      super()
      this.state = {
        Child: null
      }
    }
    
    async componentDidMount () {
      const { default: Child } = await loadComponent()

      if (this.unmount) return

      this.setState({ Child })
    }

    componentWillUnmount () {
      this.unmount = true
    }
    
    unmount = false

    render() {
      const { Child } = this.state
      return (
        Child ? <Child {...this.props} /> : <TopBarProgress />
      )
    }
  }
}