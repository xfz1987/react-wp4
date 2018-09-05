import { configure, observable, action, runInAction } from 'mobx'
import { http } from 'util'

configure({ enforceActions: 'always' })

class StatiStore {
  constructor() {
    this.getHomeCount()
  }

  @observable homeCount = {
    userCount: '-',
    productCount: '-',
    orderCount: '-'
  }
  
  @action getHomeCount = async () => {
    let data = await http('GET', '/manage/statistic/base_count.do', {}, '获取数据统计失败')
    runInAction(() => {
      this.homeCount = data
    })
  }
}

export default new StatiStore()
