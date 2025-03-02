import { LoginContainer, LoginWrapper, TabPane, TitleContainer, LogoContainer } from './styles'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import './index.less'
import { useState } from 'react'
import logo from 'src/logo.png'

const Login = ({ newAccount = false }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(newAccount ? 'register' : 'login')

  const getForm = () => {
    return (
      <div >
      <Tabs
        centered
        activeKey={activeTab}
        onChange={onChange}
        items={[
          {
            key: 'login',
            label: 'Sign In',
            children: (
              <TabPane>
                <LoginForm />
              </TabPane>
            ),
          },
          {
            key: 'register',
            label: 'Register',
            children: (
              <TabPane>
                <RegisterForm onChange={onChange} />
              </TabPane>
            ),
          },
        ]}
      />
      </div>
    )
  }

  const onChange = (key) => {
    navigate(`/${key}`)
    setActiveTab(key)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(135deg, #C2EAF1, #F4FAFC)' }}>
    <div style={{ position: 'relative', zIndex: 1 }}>
    <LoginWrapper>
      <LoginContainer>
      <LogoContainer>
        <img src={logo}/>
        <TitleContainer> 
        RoomScout
        </TitleContainer>
      </LogoContainer>
        {/* <TitleContainer>
          {newAccount ? 'Welcome!' : 'Welcome Back!'}
        </TitleContainer> */}
        {getForm()}
      </LoginContainer>
    </LoginWrapper>
    </div>

  </div>
  )
}

export default Login
