import { Button, Input } from 'antd'
import { Form } from 'antd'
import { Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { verfiyEmail } from 'src/apis/newUser'
import { FlexEnd } from 'src/global-styles/utils'
import { verificationCodeValidation } from 'src/utils/regex'

const EmailVerification = ({
  showVerificationDialog = false,
  onClose = null,
}) => {
  const [form] = useForm()

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const requestObj = {
        verification_code: values.verificationCode,
      }

      const res = await verfiyEmail(requestObj)

      if (res) {
        onClose()()
        console.log(res)
      }
    })
  }

  return (
    <Modal
      title="Verification Pending"
      closable={true}
      footer={null}
      centered={true}
      open={showVerificationDialog}
      onCancel={onClose && onClose()}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="verificationCode"
          label="Verification Code"
          rules={[
            { required: true, message: 'Please enter the code' },
            {
              pattern: verificationCodeValidation,
              message: 'Please enter valid code',
            },
          ]}
        >
          <Input placeholder="Enter your code" />
        </Form.Item>
        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EmailVerification
