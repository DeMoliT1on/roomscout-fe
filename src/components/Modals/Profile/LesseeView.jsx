import { Button, Form } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { Alert } from 'antd'
import { LesseeProfileInfoMessage } from './constants'
import { educationEmailValidation } from 'src/utils/regex'
import { Upload } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FlexEnd } from 'src/global-styles/utils'
import { getLesseeProfile, saveLesseeProfile } from 'src/apis/profileSetup'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Tag } from 'antd'
import { App } from 'antd'
const { Dragger } = Upload

const LesseeView = ({ user }) => {
  const [form] = useForm()
  const [loading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(false)
  const [formValues, setFormValues] = useState(null)
  const { notification } = App.useApp()

  useEffect(() => {
    getInitialData()
  }, [])

  const getInitialData = async () => {
    setLoading(true)
    const res = await getLesseeProfile(user.userId)
    if (res.success) {
      form.setFieldsValue({
        idCardName: res.data.document.file_name,
      })
      setFormValues({
        isVerified: res.data.is_verified,
      })
      setDisabled(true)
    }
    setLoading(false)
  }

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('document', values.idCard.file.originFileObj)
      setLoading(true)
      const response = await saveLesseeProfile(user.userId, formData)
      getInitialData()
      setLoading(false)

      if (response.success) {
        notification.success({
          message: 'Profile Info Saved',
          description: 'Your information has been saved successfully',
        })
      } else if (response.error) {
        notification.error({
          message: 'Request Failed',
          description: response.message,
        })
      }
    })
  }

  return (
    <Spin indicator={<LoadingOutlined spin />} spinning={loading} size="large">
      <Alert description={LesseeProfileInfoMessage} type="info" />
      <br />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isDisabled}
      >
        <Form.Item
          name="name"
          initialValue={user && user.name}
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>
        <Form.Item name="email" initialValue={user && user.email}>
          <Input
            placeholder="Enter your University email"
            disabled={true}
            suffix={
              user && (
                <Tag color={user.isVerified ? 'success' : 'warning'}>
                  {user.isVerified
                    ? 'Email Verified'
                    : 'Email Verification Pending'}
                </Tag>
              )
            }
          />
        </Form.Item>
        {!isDisabled && (
          <Form.Item
            name="idCard"
            rules={[
              {
                message: 'Please upload a file',
                validator: (_, value) => {
                  if (value && value.fileList.length === 1) {
                    return Promise.resolve()
                  }
                  return Promise.reject()
                },
              },
            ]}
          >
            <Dragger maxCount={1}>Upload your university ID Card</Dragger>
          </Form.Item>
        )}
        {isDisabled && (
          <Form.Item name="idCardName">
            <Input
              placeholder="University Id"
              suffix={
                <Tag color={formValues.isVerified ? 'success' : 'warning'}>
                  {formValues.isVerified
                    ? 'Document Verified'
                    : 'Document verification Pending'}
                </Tag>
              }
            />
          </Form.Item>
        )}
        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default LesseeView
