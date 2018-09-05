import { configure, observable, action, runInAction, toJS } from 'mobx'
import { http } from 'util'

configure({ enforceActions: 'always' })

class ProductStore {
  constructor() {}

  @observable categoryList = []

  @observable productList = []
  
  @observable pageNum = 1

  @observable productInfo = {
    name: '',
    subtitle: '',
    categoryId: 0,
    parentCategoryId: 0,
    subImages: [],
    price: '',
    stock: '',
    detail: '',
    status: 1 // 商品状态1为在售
  }
  
  // 根据父品类id获取品类列表
  @action getCategoryList = async (id) => {
    try {
      let data = await http('POST', '/manage/category/get_category.do', { categoryId: id || 0 }, '获取品类列表失败')
      runInAction(() => {
        this.categoryList = data
      })
      return data
    } catch (err) {
      runInAction(() => {
        this.categoryList = []
      })
    }
  }

  // 修改品类名称
  @action updateCategoryName = async (category) => {
    await http('POST', '/manage/category/set_category_name.do', { data: category }, '修改失败', true)
  }

  // 新增品类
  @action saveCategory = async (category) => {
    await http('POST', '/manage/category/add_category.do', { data: category }, '新增失败', true)
  }

  // 获取商品列表
  @action getProductList = async ({ listType, pageNum = 1, searchType, keyword }) => {
    let url = '',
      data = { pageNum }
    
    if (listType == 'list') {
      url = '/manage/product/list.do'
    } else if (listType == 'search') {
      url = '/manage/product/search.do'
      data[searchType] = keyword
    }

    try {
      let res = await http('POST', url, { data }, '获取商品列表失败')
      runInAction(() => {
        this.productList = res.list
        this.pageNum = res.pageNum
        this.total = res.total
      })
    } catch (err) {
      runInAction(() => {
        this.productList = []
      })
    }
  }

  // 变更商品销售状态
  @action setProductStatus = async (productInfo) => {
    http('POST', '/manage/product/set_sale_status.do', { data: productInfo }, '变更商品销售状态失败', true)
  }
  
  // 获取商品详情
  @action getProduct = async (productId = 0) => {
    let data = await http('POST', '/manage/product/detail.do', { productId }, '获取商品详情失败')
    runInAction(() => {
      let images = data.subImages.split(',')
      data.subImages = images.map(imgUri => {
        return {
          uri: imgUri,
          url: data.imageHost + imgUri
        }
      })
      data.defaultDetail = data.detail
      this.productInfo = data
    })
  }

  // 检查保存商品的表单数据
  @action checkProduct = (product) => {
    let result = {
      status: true,
      msg: '验证通过'
    }
    // 判断用户名为空
    if (typeof product.name !== 'string' || product.name.length === 0) {
      return {
        status: false,
        msg: '商品名称不能为空！'
      }
    }
    // 判断描述不能为空
    if (typeof product.subtitle !== 'string' || product.subtitle.length === 0) {
      return {
        status: false,
        msg: '商品描述不能为空！'
      }
    }
    // 验证品类ID
    if (typeof product.categoryId !== 'number' || !(product.categoryId > 0)) {
      return {
        status: false,
        msg: '请选择商品品类！'
      }
    }
    // 判断商品价格为数字，且大于0
    if (typeof product.price !== 'number' || !(product.price >= 0)) {
      return {
        status: false,
        msg: '请输入正确的商品价格！'
      }
    }
    // 判断库存为数字，且大于或等于0
    if (typeof product.stock !== 'number' || !(product.stock >= 0)) {
      return {
        status: false,
        msg: '请输入正确的库存数量！'
      }
    }
    
    return result
  }

  // 编辑时统一改变监听的productInfo
  @action changeProductInfo = (item) => {
    let info = toJS(this.productInfo)
    this.productInfo = { ...info, ...item }
  }
  
  // 改变商品图片数据（新增和删除）
  @action changeImages = (res, index = '') => {
    let subImages = toJS(this.productInfo.subImages)
    
    if (!res && index) {
      subImages.splice(index, 1)
    } else {
      subImages.push(res)
    }
    
    this.changeProductInfo({
      subImages
    })
  }

  // 保存商品
  @action saveProduct = async (product) => {
    await http('POST', '/manage/product/save.do', { data: product }, '保存商品失败', true)
  }
}

export default new ProductStore()
