import React from 'react'
import FileUpload from './react-fileupload.js'

export default class FileUploader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const options = {
      baseUrl: '/manage/product/upload.do',
      fileFieldName: 'upload_file',
      dataType: 'json',
      chooseAndUpload: true,
      uploadSuccess: (res) => {
        this.props.onSuccess(res.data)
      },
      uploadError: (err) => {
        this.props.onError(err.message || '上传图片出错啦')
      }
    }

    return (
      <FileUpload options={options}>
        <button className="btn btn-xs btn-primary" ref="chooseAndUpload">请选择图片</button>
      </FileUpload>
    )
  }
}