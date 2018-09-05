import React from 'react'
import { observer } from 'mobx-react'
import productStore from 'stores/product.js'
import PageTitle from 'components/page-title'
import CategorySelector from './category-selector'
import FileUploader from 'components/file-uploader'
import RichEditor from 'components/rich-editor'
import { errorTips } from 'util' 

import './save.scss'

@observer
class ProductSave extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.pid,
    }
  }

  componentDidMount() {
    this.state.id && productStore.getProduct(this.state.id)
  }

  // 简单字段的改变，比如商品名称，描述，价格，库存
  onValueChange(e) {
    let name = e.target.name,
      value = e.target.value.trim();

    productStore.changeProductInfo({
      [name]: value
    })
  }

  // 品类选择器变化
  onCategoryChange(categoryId, parentCategoryId) {
    productStore.changeProductInfo({
      categoryId,
      parentCategoryId
    })
  }

  // 上传图片成功
  onUploadSuccess(res) {
    productStore.changeImages(res)
  }
  
  // 上传图片失败
  onUploadError(errMsg) {
    errorTips(errMsg);
  }

  // 删除图片
  onImageDelete(e) {
    productStore.changeImages(undefined, parseInt(e.target.getAttribute('index')))
  }

  // 富文本编辑器的变化
  onDetailValueChange(value) {
    productStore.changeProductInfo({
      detail: value
    })
  }

  getSubImagesString(imgs) {
    return imgs.map(image => image.uri).join(',')
  }

  // 提交表单
  async onSubmit() {
    let { name, subtitle, categoryId, subImages, detail, price, stock, status } = productStore.productInfo
    
    let product = {
      name,
      subtitle,
      categoryId: parseInt(categoryId),
      subImages: this.getSubImagesString(subImages),
      detail,
      price: parseFloat(price),
      stock: parseInt(stock),
      status
    }

    // 编辑，否则为添加
    if (this.state.id) product.id = this.state.id

    let productCheckResult = productStore.checkProduct(product)

    // 表单验证成功
    if (productCheckResult.status) {
      try {
        console.log(product)
        await productStore.saveProduct(product)
        this.props.history.push('/product/index')
      } catch (err) {
        console.log(err)
      }
    } else {
      errorTips(productCheckResult.msg)
    }
  }

  render() {
    let { name, subtitle, categoryId, parentCategoryId, price, stock, subImages = [], detail, defaultDetail } = productStore.productInfo

    return (
      <div className="page-wrapper">
        <PageTitle title={this.state.id ? '编辑商品' : '添加商品'} />
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-md-2 control-label">商品名称</label>
            <div className="col-md-5">
              <input type="text" className="form-control" 
                placeholder="请输入商品名称"
                name="name"
                value={name}
                onChange={e => this.onValueChange(e)}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品描述</label>
            <div className="col-md-5">
              <input type="text" className="form-control" 
                placeholder="请输入商品名称"
                name="subtitle"
                value={subtitle}
                onChange={e => this.onValueChange(e)}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">所属分类</label>
            <CategorySelector 
              categoryId={categoryId}
              parentCategoryId={parentCategoryId}
              onCategoryChange={(categoryId, parentCategoryId) => this.onCategoryChange(categoryId, parentCategoryId)}/>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品价格</label>
            <div className="col-md-3">
              <div className="input-group">
                <input type="number" className="form-control" 
                  placeholder="价格" 
                  name="price"
                  value={price}
                  onChange={e => this.onValueChange(e)}/>
                <span className="input-group-addon">元</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品库存</label>
            <div className="col-md-3">
              <div className="input-group">
                <input type="number" className="form-control" 
                  placeholder="库存" 
                  name="stock"
                  value={stock}
                  onChange={e => this.onValueChange(e)}/>
                <span className="input-group-addon">件</span>
              </div>              
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品图片</label>
            <div className="col-md-10">
              {
                subImages.length ? subImages.map((image, index) => (
                  <div className="img-con" key={index}>
                    <img className="img" src={image.url} />
                    <i className="fa fa-close" index={index} onClick={(e) => this.onImageDelete(e)}></i>
                  </div>
                )) : (<div style={{ marginTop: '7px' }}>请上传图片</div>)
              }
            </div>
            <div className="col-md-offset-2 col-md-10 file-upload-con">
              <FileUploader 
                onSuccess={res => this.onUploadSuccess(res)}
                onError={errMsg => this.onUploadError(errMsg)}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-2 control-label">商品详情</label>
            <div className="col-md-10">
              <RichEditor 
                detail={detail}
                defaultDetail={defaultDetail}
                onValueChange={v => this.onDetailValueChange(v)}/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-offset-2 col-md-10">
              <button type="submit" className="btn btn-primary" 
                onClick={e => this.onSubmit(e)}>提交</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductSave
