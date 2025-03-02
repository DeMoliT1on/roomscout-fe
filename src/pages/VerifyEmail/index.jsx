import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { requestNewVerifyLink, verfiyEmail } from 'src/apis/newUser'
import { notification } from 'antd'
import { App } from 'antd'
import { CUSTOM_STATUS } from 'src/utils/enum'
import { Modal } from 'antd'

const VerifyEmail = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { notification, modal } = App.useApp()
  const navigate = useNavigate()

  useEffect(() => {
    verifyEmailApiCall()
    navigate('/')
  }, [searchParams])

  const verifyEmailApiCall = async () => {
    const token = searchParams.get('token')
    const role = +searchParams.get('role')

    const response = await verfiyEmail({ token, role })

    if (response.message) {
      notification.info({
        message: 'Verification Successful',
        description: response.message,
      })
    } else if (response.error) {
      const status = response.error.status
      if (status && CUSTOM_STATUS.VERIFY_EMAIL_TOKEN_EXPIRED === status) {
        notification.error({
          message: 'Verification failed',
          description: response.error.message,
        })
        modal.warning({
          title: 'Verification Link Expired',
          content:
            'Your verification link has expired. Do you want to generate a new one?',
          centered: true,
          closable: true,
          onOk: () => requestNewLink({ token, role }),
          okText: 'Generate New Link',
          cancelText: 'Cancel',
        })
      } else if (
        status &&
        CUSTOM_STATUS.VERIFY_EMAIL_INVALID_TOKEN === status
      ) {
        notification.error({
          message: 'Verification failed',
          description: 'Invalid Token',
        })
      } else {
        notification.error({
          message: 'Verification failed',
          description: response.error.message,
        })
      }
    }
  }

  const requestNewLink = async ({ token, role }) => {
    const response = await requestNewVerifyLink({ token, role })
    if (response.message) {
      notification.info({
        message: 'New Link Generated',
        description: response.message,
      })
    }
  }

  return <></>
}

export default VerifyEmail
