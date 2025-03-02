import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { UserRoles } from 'src/utils/enum'
import './index.less'
import LesseeView from './LesseeView'
import LessorView from './LessorView'

const Profile = ({ isProfileOpen, onClose }) => {
  const user = useSelector((state) => state.auth.user)

  return (
    <Modal
      title="Your Profile"
      centered={true}
      closable={true}
      open={isProfileOpen}
      onCancel={onClose}
      footer={null}
      width={'150vh'}
      maskClosable={false}
      destroyOnClose={true}
    >
      {user.role === UserRoles.Lessee ? (
        <LesseeView user={user} />
      ) : (
        <LessorView user={user} />
      )}
    </Modal>
  )
}

export default Profile
