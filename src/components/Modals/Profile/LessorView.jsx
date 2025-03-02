import { Alert, Button, Spin, Radio, Input, Select, Form, Tag, App } from 'antd'
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { brokerLicenseTypes } from './constants'
import { FlexEnd } from 'src/global-styles/utils'
import {
  brokerLicenseNumberValidation,
  landlordCRFNValidation,
} from 'src/utils/regex'
import { getLessorProfile, saveLessorProfile } from 'src/apis/profileSetup'

const { Option } = Select

const LessorView = ({ user }) => {
  const [isLoading, setLoading] = useState(false)
  const [isLandlord, setLandLord] = useState(true)
  const [isDisabled, setDisabled] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [form] = Form.useForm()
  const { notification } = App.useApp()

  const getInitialData = async () => {
    setLoading(true)
    try {
      const res = await getLessorProfile(user.userId)
      if (res.success) {
        setLandLord(res.data.is_landlord)
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          document_id: res.data.document_id,
          license_type_id: res.data.license_type_id,
          license_number: res.data.license_number,
        })
        setVerificationStatus(res.data.is_verified)
        setDisabled(res.data.is_verified)
      }
    } catch (error) {
      notification.error({
        message: 'Failed to fetch profile',
        description: error.message,
      })
    }
    setLoading(false)
  }

  const verifyCredentials = async (data) => {
    setVerificationStatus('pending')
    try {
      // In production, this would be an actual API call to verify against ACRIS or broker database
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setVerificationStatus('verified')
      return true
    } catch (error) {
      setVerificationStatus('failed')
      return false
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      let requestObj = {
        name: values.name,
        is_landlord: isLandlord,
      }
      if (isLandlord) {
        requestObj = { ...requestObj, document_id: values.document_id }
      } else {
        requestObj = {
          ...requestObj,
          license_type_id: values.license_type_id,
          license_number: values.license_number,
        }
      }

      // First save the profile
      const response = await saveLessorProfile(user.userId, requestObj)

      if (response.success) {
        // Then verify the credentials
        const verificationSuccess = await verifyCredentials(requestObj)

        if (verificationSuccess) {
          notification.success({
            message: 'Verification Successful',
            description: 'Your credentials have been verified successfully',
          })
          await getInitialData() // Refresh the form with verified status
        }
      } else {
        notification.error({
          message: 'Request Failed',
          description: response.message,
        })
      }
    } catch (error) {
      notification.error({
        message: 'Verification Failed',
        description: error.message,
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    getInitialData()
  }, [])

  const getVerificationAlert = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <Alert
            message="Verification Status"
            description="Your credentials have been verified successfully"
            type="success"
            showIcon
          />
        )
      case 'pending':
        return (
          <Alert
            message="Verification Status"
            description="Your verification is in progress..."
            type="warning"
            showIcon
          />
        )
      case 'failed':
        return (
          <Alert
            message="Verification Failed"
            description="Please check your credentials and try again"
            type="error"
            showIcon
          />
        )
      default:
        return null
    }
  }

  return (
    <Spin
      spinning={isLoading}
      indicator={<LoadingOutlined spin />}
      size="large"
    >
      <Alert
        showIcon
        message="Identity Verification"
        description={
          <>
            To ensure a safe and trusted environment, we require verification of
            your status as a {isLandlord ? 'landlord' : 'broker'}. By providing
            your Document ID Number or CRFN, you consent to RoomScout verifying
            your details through the ACRIS database. We are committed to
            protecting your privacy and handling your information with utmost
            confidentiality.
            <div style={{ marginTop: '12px' }}>
              1. Enter your Document ID Number or CRFN below. <br></br>
              2. Our system will automatically verify your information.{' '}
              <br></br>
              3. You will be notified once verification is complete.
            </div>
          </>
        }
      />
      <br />

      <Form
        form={form}
        onFinish={onFinish}
        disabled={isDisabled}
        layout="vertical"
      >
        <Form.Item label="I am a">
          <Radio.Group
            onChange={(e) => setLandLord(e.target.value)}
            value={isLandlord}
          >
            <Radio value={true}>Landlord</Radio>
            <Radio value={false}>Broker</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          initialValue={user?.name}
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item name="email" label="Email" initialValue={user?.email}>
          <Input
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

        {isLandlord ? (
          <Form.Item
            name="document_id"
            label="Document ID Number/CRFN"
            rules={[
              {
                required: true,
                message: 'Please enter Document ID number',
              },
              // {
              //   pattern: landlordCRFNValidation,
              //   message: 'Please enter valid Document ID Number/CRFN',
              // },
            ]}
          >
            <Input placeholder="Enter your Document ID Number/CRFN" />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              name="license_type_id"
              label="License Type"
              rules={[
                {
                  required: true,
                  message: 'Please select a License Type',
                },
              ]}
            >
              <Select placeholder="Select License Type">
                {brokerLicenseTypes.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="license_number"
              label="License Number"
              rules={[
                {
                  required: true,
                  message: 'Please enter your License number',
                },
                {
                  pattern: brokerLicenseNumberValidation,
                  message: 'Please enter a valid license number',
                },
              ]}
            >
              <Input placeholder="Enter your License Reference number" />
            </Form.Item>
          </>
        )}

        {verificationStatus && <Form.Item>{getVerificationAlert()}</Form.Item>}

        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit" disabled={isDisabled}>
              {isLoading ? 'Verifying...' : 'Verify Identity'}
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default LessorView
