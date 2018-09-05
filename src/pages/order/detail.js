import React from 'react';
import { observer } from 'mobx-react'
import orderStore from 'stores/order.js'
import PageTitle from 'components/page-title'
import TableList from 'components/table-list'

import './detail.scss';

@observer
class OrderDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orderNumber: this.props.match.params.orderNumber
    }
  }

  componentDidMount() {
    orderStore.getOrderDetail(this.state.orderNumber)
  }

  // 发货操作
  onSendGoods() {
    if (window.confirm('是否确认该订单已经发货？')) {
      orderStore.sendGoods(this.state.orderNumber)
    }
  }

  render() {
    let { 
      orderNo,
      createTime,
      statusDesc,
      status,
      paymentTypeDesc,
      payment,
      imageHost,
      shippingVo: receiverInfo = {},
      orderItemVoList: productList = []
    } = orderStore.orderInfo

    let tableHeads = [
      { name: '商品图片', width: '10%' },
      { name: '商品信息', width: '45%' },
      { name: '单价', width: '15%' },
      { name: '数量', width: '15%' },
      { name: '合计', width: '15%' }
    ]
    
    return (
      <div className="page-wrapper">
        <PageTitle title="订单详情" />
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-md-2 control-label">订单号</label>
            <div className="col-md-5">
              <p className="form-control-static">{orderNo}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">创建时间</label>
            <div className="col-md-5">
              <p className="form-control-static">{createTime}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">收件人</label>
            <div className="col-md-5">
              <p className="form-control-static">
                {receiverInfo.receiverName}，
                {receiverInfo.receiverProvince} 
                {receiverInfo.receiverCity} 
                {receiverInfo.receiverAddress} 
                {receiverInfo.receiverMobile || receiverInfo.receiverPhone}
              </p>
            </div>
          </div> 
          <div className="form-group">
            <label className="col-md-2 control-label">订单状态</label>
            <div className="col-md-5">
              <p className="form-control-static">
                {statusDesc}
                {
                  status === 20
                    ? <button className="btn btn-default btn-sm btn-send-goods"
                      onClick={e => this.onSendGoods()}>立即发货</button>
                    : null
                }
              </p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">支付方式</label>
            <div className="col-md-5">
              <p className="form-control-static">
                {paymentTypeDesc}
              </p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">订单金额</label>
            <div className="col-md-5">
              <p className="form-control-static">
                ￥{payment}
              </p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品列表</label>
            <div className="col-md-10">
              <TableList tableHeads={tableHeads}>
                {
                  productList.map((product, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <img className="p-img" alt={product.productName}
                            src={`${imageHost}${product.productImage}`} />
                        </td>
                        <td>{product.productName}</td>
                        <td>￥{product.currentUnitPrice}</td>
                        <td>{product.quantity}</td>
                        <td>￥{product.totalPrice}</td>
                      </tr>
                    )
                  })
                }
              </TableList>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OrderDetail
