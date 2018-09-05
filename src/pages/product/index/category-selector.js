import React from 'react'
import { observer } from 'mobx-react'
import productStore from 'stores/product.js'

import './category-selector.scss'

@observer
class CategorySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstCategoryList: [],
      firstCategoryId: 0,
      secondCategoryList: [],
      secondCategoryId: 0,
      categoryId: '',
      parentCategoryId: '',
    }
  }
  
  static getDerivedStateFromProps({ categoryId, parentCategoryId }, prevState) {
    let categoryIdChange = prevState.categoryId !== categoryId,
      parentCategoryIdChange = prevState.parentCategoryId !== parentCategoryId

    // 数据没有发生变化的时候，直接不做处理
    if (!categoryIdChange && !parentCategoryIdChange) return null
    
    if (parentCategoryId === 0) {
      // 假如只有一级品类
      return {
        firstCategoryId: categoryId,
        secondCategoryId: 0,
        categoryId,
        parentCategoryId
      }
    } else {
      return {
        firstCategoryId: parentCategoryId,
        secondCategoryId: categoryId,
        categoryId,
        parentCategoryId,
      }
    }
  }

  componentDidMount() {
    console.log('did')
    this.loadFirstCategory()
  }

  // UNSAFE_componentWillReceiveProps({ categoryId, parentCategoryId }) {
  //   let categoryIdChange = this.props.categoryId !== categoryId,
  //     parentCategoryIdChange = this.props.parentCategoryId !== parentCategoryId

  //   // 数据没有发生变化的时候，直接不做处理
  //   if (!categoryIdChange && !parentCategoryIdChange) return false
    
  //   if (parentCategoryId === 0) {
  //     // 假如只有一级品类
  //     this.setState({
  //       firstCategoryId: categoryId,
  //       secondCategoryId: 0
  //     })
  //   } else {
  //     // 有两级品类
  //     this.setState({
  //       firstCategoryId: parentCategoryId,
  //       secondCategoryId: categoryId
  //     }, () => {
  //       parentCategoryIdChange && this.loadSecondCategory();
  //     })
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    // 数据没有发生变化的时候，直接不做处理
    if (this.props.parentCategoryId !== prevState.parentCategoryId && this.props.parentCategoryId !== 0) {
      console.log(1111)
      this.loadSecondCategory()
    } 
  }
  
  // 加载一级分类
  async loadFirstCategory() {
    let data = await productStore.getCategoryList()
    // data = toJS(data)

    this.setState({
      firstCategoryList: data
    })
  }

  // 加载二级分类
  async loadSecondCategory() {
    let data = await productStore.getCategoryList(this.state.firstCategoryId)

    this.setState({
      secondCategoryList: data
    })
  }

  // 选择一级品类
  onFirstCategoryChange(e) {
    if (this.props.readOnly) return false
    
    this.setState({
      firstCategoryId: e.target.value || 0,
      secondCategoryId: 0,
      secondCategoryList: []
    }, () => {
      // 更新二级品类
      this.loadSecondCategory()
      this.onPropsCategoryChange()
    })
  }
    
  // 选择二级品类
  onSecondCategoryChange(e) {
    if (this.props.readOnly) return false
    
    this.setState({
      secondCategoryId: e.target.value || 0
    }, () => {
      this.onPropsCategoryChange()
    });
  }

  // 传给父组件选中的结果
  onPropsCategoryChange() {
    // 判断props里的回调函数存在
    let categoryChangable = typeof this.props.onCategoryChange === 'function'
    
    // 如果是有二级品类
    if (this.state.secondCategoryId) {
      categoryChangable && this.props.onCategoryChange(this.state.secondCategoryId, this.state.firstCategoryId)
    } else {
      // 如果只有一级品类
      categoryChangable && this.props.onCategoryChange(this.state.firstCategoryId, 0)
    }
  }

  render() {
    return (
      <div className="col-md-10">
        <select
          className="form-control cate-select"
          value={this.state.firstCategoryId}
          onChange={e => this.onFirstCategoryChange(e)}
          readOnly={this.props.readOnly}>
          <option value="">请选择一级分类</option>
          {
            this.state.firstCategoryList.map((category, index)=> (
              <option value={category.id} key={index}>{category.name}</option>
            ))
          }
        </select>
        {this.state.secondCategoryList.length
          ? <select 
            className="form-control cate-select"
            value={this.state.secondCategoryId}
            onChange={e => this.onSecondCategoryChange(e)}
            readOnly={this.props.readOnly}>
            <option value="">请选择二级分类</option>
            {
              this.state.secondCategoryList.map((category, index)=> (
                <option value={category.id} key={index}>{category.name}</option>
              ))
            }
          </select>
          : null
        }
      </div>
    )
  }
}

export default CategorySelector
