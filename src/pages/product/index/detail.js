import React from 'react'
import { observer } from 'mobx-react'
import productStore from 'stores/product.js'
import PageTitle from 'components/page-title'
import CategorySelector from './category-selector.js'

import './save.scss'

@observer
class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.pid,
      parentCategoryId: 0
    }
  }

  componentDidMount() {
    if (!this.state.id) return false
    productStore.getProduct(this.state.id)
  }

  render() {
    let { categoryId, parentCategoryId, name, subtitle, price, stock, subImages, detail } = productStore.productInfo

    return (
      <div className="page-wrapper">
        <PageTitle title="添加商品" />
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-md-2 control-label">商品名称</label>
            <div className="col-md-5">
              <p className="form-control-static">{name}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品描述</label>
            <div className="col-md-5">
              <p className="form-control-static">{subtitle}</p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">所属分类</label>
            <CategorySelector 
              readOnly
              categoryId={categoryId}
              parentCategoryId={parentCategoryId}
            />
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品价格</label>
            <div className="col-md-3">
              <div className="input-group">
                <p className="form-control">{price}</p>
                <span className="input-group-addon">元</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品库存</label>
            <div className="col-md-3">
              <div className="input-group">
                <p className="form-control">{stock}</p>
                <span className="input-group-addon">件</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品图片</label>
            <div className="col-md-10">
              {
                (subImages && subImages.length) ? subImages.map((image, index) => (
                  <div className="img-con" key={index}>
                    <img className="img" src={image.url} />
                  </div>)
                ) : (<div>暂无图片</div>)
              }
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品详情</label>
            <div className="col-md-10" dangerouslySetInnerHTML={{ __html: detail }}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductDetail 
