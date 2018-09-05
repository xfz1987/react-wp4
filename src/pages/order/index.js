import React from 'react';
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import orderStore from 'stores/order.js'

import PageTitle from 'components/page-title'
import ListSearch from './index-list-search.js'
import TableList from 'components/table-list'
import Pagination from 'components/pagination'

@observer
class OrderList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    orderStore.getOrderList()
  }

  render() {
    let tableHeads = ['订单号', '收件人', '订单状态', '订单总价', '创建时间', '操作'];
    let { list, pageNum, total } = orderStore
    return (
      <div className="page-wrapper">
        <PageTitle title="订单列表" />
        <ListSearch onSearch={orderNumber => orderStore.changeType(orderNumber === '' ? 'list' : 'search', orderNumber)} />
        <TableList tableHeads={tableHeads}>
          {
            list.map((order, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link to={`/order/detail/${order.orderNo}`}>{order.orderNo}</Link>
                  </td>
                  <td>{order.receiverName}</td>
                  <td>{order.statusDesc}</td>
                  <td>￥{order.payment}</td>
                  <td>{order.createTime}</td>
                  <td>
                    <Link to={`/order/detail/${order.orderNo}`}>详情</Link>
                  </td>
                </tr>
              )
            })
          }
        </TableList>
        <Pagination current={pageNum} 
          total={total} 
          onChange={pageNum => orderStore.getOrderList(pageNum)}/>
      </div>
    )
  }
}

export default OrderList
