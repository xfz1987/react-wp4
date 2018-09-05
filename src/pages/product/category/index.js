import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import productStore from 'stores/product.js'

import PageTitle from 'components/page-title'
import TableList from 'components/table-list';

@observer
class CategoryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      parentCategoryId: this.props.match.params.categoryId || 0
    }
  }

  componentDidMount() {
    this.loadCategoryList()
  }

  componentDidUpdate(prevProps, prevState) {
    let oldPath = prevProps.location.pathname,
      newPath = this.props.location.pathname,
      newId = this.props.match.params.categoryId || 0
    
    if (oldPath !== newPath) {
      this.setState({
        parentCategoryId: newId
      }, () => {
        this.loadCategoryList()
      })
    }
  }
  
  // 加载品类列表
  loadCategoryList() {
    productStore.getCategoryList(this.state.parentCategoryId)
  }
  
  // 更新品类的名字
  async onUpdateName(categoryId, categoryName) {
    let newName = window.prompt('请输入新的品类名称', categoryName)
    
    if (newName) {
      try {
        await productStore.updateCategoryName({
          categoryId,
          categoryName: newName
        })
      
        this.loadCategoryList()
      } catch (err) {
        console.error(err)
      }
    }
  }

  render() {
    let listBody = productStore.categoryList.map((category, index) => {
      return (
        <tr key={index}>
          <td>{category.id}</td>
          <td>{category.name}</td>
          <td>
            <a className="opear"
              onClick={(e) => this.onUpdateName(category.id, category.name)}
            >修改名称</a>
            {
              category.parentId === 0
                ? <Link to={`/product-category/index/${category.id}`}> 查看子品类</Link>
                : null
            }
          </td> 
        </tr>
      )
    })
    
    return (
      <div className="page-wrapper">
        <PageTitle title="品类列表">
          <div className="page-header-right">
            <Link to="/product-category/add" className="btn btn-primary">
              <i className="fa fa-plus"></i>
              <span>添加品类</span>
            </Link>
          </div>
        </PageTitle>
        <div className="row">
          <div className="col-md-12">
            <p>父品类ID: {this.state.parentCategoryId}</p>
          </div>
        </div>
        <TableList tableHeads={['品类ID', '品类名称', '操作']}>
          {listBody}
        </TableList>
      </div>
    )
  }
}

export default CategoryList
