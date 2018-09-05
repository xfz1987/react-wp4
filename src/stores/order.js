import { configure, observable, action, runInAction } from 'mobx'
import { http } from 'util'

configure({ enforceActions: 'always' })

class OrderStore {
  constructor() {}
  
  @observable list = []

  @observable pageNum = 1

  @observable total = 0
  
  @observable listType = 'list' // list / search
  
  @observable orderInfo = {}

  @action changeType = (type, order) => {
    this.listType = type
    this.getOrderList(this.pageNum, order)
  }

  // 获取订单列表
  @action getOrderList = async (pageNum = 1, orderNo = '') => {
    let url = '',
      data = {}
      
    if (this.listType === 'list') {
      url = '/manage/order/list.do'
      data.pageNum = pageNum
    } else if (this.listType === 'search') {
      url = '/manage/order/search.do'
      data.pageNum = pageNum
      data.orderNo = orderNo
    }

    console.log(data)
    
    try {
      let res = await http('POST', url, { data }, '获取订单列表失败')
      runInAction(() => {
        this.list = res.list
        this.pageNum = res.pageNum
        this.total = res.total 
      })
    } catch (err) {
      runInAction(() => {
        this.list = []
      })
    }
  }

  @action getOrderDetail = async (orderNo) => {
    let data = await http('POST', '/manage/order/detail.do', { orderNo }, '获取详情失败')
    runInAction(() => {
      this.orderInfo = data
    })
  }

  @action sendGoods = async (orderNo) => {
    await http('POST', '/manage/order/send_goods.do', { orderNo })
  }
}

export default new OrderStore()
