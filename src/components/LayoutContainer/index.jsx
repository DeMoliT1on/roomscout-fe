import { Layout, Menu, Typography } from 'antd'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { routeLists } from 'src/navigation/routeLists'
import { UserOutlined } from '@ant-design/icons'
import { ProfileContainer, ProfileInfoContainer } from './styles'
import { Popover } from 'antd'
import { useSelector } from 'react-redux'
import { CTAS } from 'src/global-styles/utils'
import { useAuth } from '../AuthProvider'
import { clearAuthOnLogout } from 'src/utils/storage'
import Profile from '../Modals/Profile'
import { useState } from 'react'
import { UserRoles } from 'src/utils/enum'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const LayoutContainer = () => {
  const navigate = useNavigate()

  const [isProfileOpen, setProfileOpen] = useState(false)
  const [isPopOverMenuOpen, setPopOverOpen] = useState(false)

  const user = useSelector((state) => state.auth.user)

  const { logout } = useAuth()

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`)
  }

  const handleSignOut = () => {
    clearAuthOnLogout()
    logout()
  }

  const profileMenu = (
    <Menu
      mode="inline"
      selectable={false}
      style={{
        width: '150px', // Set an appropriate width
        padding: '8px', // Add padding for better spacing
        borderInlineEnd: 'none',
      }}
    >
      <Menu.Item
        key="profile"
        style={{
          fontSize: '16px', // Increase font size for better readability
          padding: '10px 12px', // Add padding for menu items
        }}
        onClick={() => {
          setProfileOpen(true)
          setPopOverOpen(false)
        }}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        key="signout"
        style={{
          fontSize: '16px', // Increase font size for consistency
          padding: '10px 12px',
        }}
        onClick={handleSignOut}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  )

  const onProfileClose = () => {
    setProfileOpen(false)
  }

  const handlePopOverOpenChange = (newOpen) => {
    setPopOverOpen(newOpen)
  }

  const getMenuItems = () => {
    if (user.role === UserRoles.VerificationSupport) {
      return [
        // <Menu.Item key="lessor-verifications">{`Lessor Verifications`}</Menu.Item>,
        <Menu.Item key="property-verifications">{`Property Verifications`}</Menu.Item>,
      ]
    } else if (user.role === UserRoles.Lessor) {
      return [
        <Menu.Item key="properties">{`Manage Properties`}</Menu.Item>,
        <Menu.Item key="about">{`About Us`}</Menu.Item>,
        // <Menu.Item key="contact">{`Contact`}</Menu.Item>,
      ]
    } else {
      return [
        <Menu.Item key="search-properties">{`Search Properties`}</Menu.Item>,
        <Menu.Item key="wishlist">{`Wishlist`}</Menu.Item>,
        <Menu.Item key="about">{`About Us`}</Menu.Item>,
        // <Menu.Item key="contact">{`Contact`}</Menu.Item>,
      ]
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #C2EAF1, #F4FAFC)', // Gradient background
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
          background: 'transparent', // Keep layout background transparent
        }}
      >
        {/* Header with Navigation */}
        <Header
          style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for header
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
            padding: '0 20px', // Add padding for better spacing
          }}
        >
          {/* Left - Navigation Menu */}
          <div style={{ flex: 1 }}>
            <Menu
              mode="horizontal"
              onClick={handleMenuClick}
              style={{
                backgroundColor: 'transparent', // Keep transparent for consistency
                border: 'none', // Remove border for cleaner look
              }}
            >
              {getMenuItems()}
            </Menu>
          </div>

          {/* Center - Logo and Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="logo.png"
              alt="RoomScout Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#0C2A3C',
              }}
            >
              RoomScout
            </span>
          </div>

          {/* Right - Profile Info */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              marginRight: '20px',
            }}
          >
            <ProfileContainer>
              <Popover
                trigger={'click'}
                content={profileMenu}
                open={isPopOverMenuOpen}
                onOpenChange={handlePopOverOpenChange}
              >
                <ProfileInfoContainer>
                  <UserOutlined style={CTAS} />
                  <Text>{user.email}</Text>
                </ProfileInfoContainer>
              </Popover>
            </ProfileContainer>
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{ padding: '50px 50px', marginTop: 64 }}>
          <Routes>
            {routeLists.map((o) => {
              return <Route key={o.key} path={o.path} Component={o.component} />
            })}
          </Routes>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>
          {`RoomScout © 2024. Made with ❤️ in Brooklyn.`}
        </Footer>

        <Profile isProfileOpen={isProfileOpen} onClose={onProfileClose} />
      </Layout>
    </div>
  )
}

export default LayoutContainer
