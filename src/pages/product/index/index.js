import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import productStore from 'stores/product.js'
import ListSearch from './index-list-search.js'
import PageTitle from 'components/page-title'
import TableList from 'components/table-list'
import Pagination from 'components/pagination'

import './index.scss'

@observer
class ProductList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listType: 'list',
      searchType: '',
      searchKeyword: ''
    }
  }

  componentDidMount() {
    this.loadProductList()
  }

  loadProductList(pageNum) {
    let { listType, searchType, searchKeyword } = this.state
    let listParam = { listType, pageNum }
    
    // 如果是搜索的话，需要传入搜索类型和搜索关键字
    if (listType === 'search') {
      listParam = { ...listParam, searchType, keyword: searchKeyword }
    }
  
    productStore.getProductList(listParam)
  }

  // 搜索
  onSearch(searchType, searchKeyword) {
    this.setState({
      listType: searchKeyword === '' ? 'list' : 'search',
      searchType: searchType,
      searchKeyword: searchKeyword
    }, () => {
      this.loadProductList();
    })
  }
  
  // 改变商品状态，上架 / 下架
  onSetProductStatus(e, productId, currentStatus) {
    let newStatus = currentStatus == 1 ? 2 : 1,
      confrimTips = currentStatus == 1 ? '确定要下架该商品？' : '确定要上架该商品？'

    if (window.confirm(confrimTips)) {
      productStore.setProductStatus({ productId, status: newStatus })
      this.loadProductList();
    }
  }

  onPageNumChange(pageNum) {
    this.loadProductList(pageNum)
  }

  render() {
    let tableHeads = [
      { name: '商品ID', width: '10%' },
      { name: '商品信息', width: '50%' },
      { name: '价格', width: '10%' },
      { name: '状态', width: '15%' },
      { name: '操作', width: '15%' },
    ]

    let { productList, pageNum, total } = productStore

    let listBody = productList.map(product => (
      <tr key={product.id}>
        <td>{product.id}</td>
        <td>
          <p>{product.name}</p>
          <p>{product.subtitle}</p>
        </td>
        <td>￥{product.price}</td>
        <td>
          <p>{product.status == 1 ? '在售' : '已下架'}</p>
          <button 
            className="btn btn-xs btn-warning" 
            onClick={e => this.onSetProductStatus(e, product.id, product.status)}>
            {product.status == 1 ? '下架' : '上架'}
          </button>
        </td>
        <td>
          <Link className="opear" to={`/product/detail/${product.id}`}>详情</Link>
          <Link className="opear" to={`/product/save/${product.id}`}>编辑</Link>
        </td>
      </tr>
    ))

    return (
      <div className="page-wrapper">
        <PageTitle title="商品列表">
          <div className="page-header-right">
            <Link to="/product/save" className="btn btn-primary">
              <i className="fa fa-plus"></i>
              <span>添加商品</span>
            </Link>
          </div>
        </PageTitle>
        <ListSearch onSearch={(searchType, searchKeyword) => this.onSearch(searchType, searchKeyword)}/>
        <TableList tableHeads={tableHeads}>
          {listBody}
        </TableList>
        <Pagination current={pageNum} 
          total={total} 
          onChange={pageNum => this.onPageNumChange(pageNum)}
        />
      </div>
    )
  }
}

export default ProductList
