import React from 'react'
import { observer, inject } from 'mobx-react'

import PageTitle from 'components/page-title'
import TableList from 'components/table-list'
import Pagination from 'components/pagination'

@inject('userStore')
@observer
class UserList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.userStore.getUserList()
  }

  render() {
    let { list, pageNum, total, getUserList } = this.props.userStore

    let listBody = list.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
          <td>{new Date(user.createTime).toLocaleString()}</td>
        </tr>
      )
    })

    return (
      <div className="page-wrapper">
        <PageTitle title="用户列表"/>
        <TableList tableHeads={['ID', '用户名', '邮箱', '电话', '注册时间']}>
          {listBody}
        </TableList>
        <Pagination current={pageNum} 
          total={total} 
          onChange={pageNum => getUserList(pageNum)}
        />
      </div>
    )
  }
}

export default UserList
