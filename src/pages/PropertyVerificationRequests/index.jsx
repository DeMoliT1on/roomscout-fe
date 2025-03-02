import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
  Card,
  Modal,
  notification,
  Typography,
  Tooltip,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import propertiesService from 'src/apis/propertiesService'

const { Title } = Typography

const STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED = 0
const STATUS_VERIFICATION_PROPERTY_SUBMITTED = 1
const STATUS_VERIFICATION_PROPERTY_DENIED = 2
const STATUS_VERIFICATION_PROPERTY_VERIFIED = 3

const PropertyVerificationTable = () => {
  const [propertyListing, setPropertyListing] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState([
    STATUS_VERIFICATION_PROPERTY_SUBMITTED,
  ])

  const statusFilters = [
    {
      label: 'Pending Requests',
      value: STATUS_VERIFICATION_PROPERTY_SUBMITTED,
    },
    { label: 'Denied', value: STATUS_VERIFICATION_PROPERTY_DENIED },
    { label: 'Verified', value: STATUS_VERIFICATION_PROPERTY_VERIFIED },
  ]

  const getStatusTag = (status) => {
    switch (status) {
      case STATUS_VERIFICATION_PROPERTY_SUBMITTED:
        return (
          <Tag icon={<SyncOutlined />} color="processing">
            Pending Verification
          </Tag>
        )
      case STATUS_VERIFICATION_PROPERTY_DENIED:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Verification Denied
          </Tag>
        )
      case STATUS_VERIFICATION_PROPERTY_VERIFIED:
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Verified
          </Tag>
        )
      default:
        return null
    }
  }

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await propertiesService.getAllPropertyListings()
      if (response.data) {
        const filteredProperties = response.data.properties.filter(
          (property) =>
            property.status_verification !==
            STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED
        )
        setPropertyListing(filteredProperties)
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to fetch properties',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleStatusUpdate = async (propertyId, action) => {
    const isApproval = action === 'approve'

    Modal.confirm({
      title: `Confirm ${isApproval ? 'Approval' : 'Rejection'}`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${
        isApproval ? 'approve' : 'reject'
      } this property?`,
      okText: isApproval ? 'Approve' : 'Reject',
      okButtonProps: {
        type: isApproval ? 'primary' : 'danger',
      },
      onOk: async () => {
        setLoading(true)
        try {
          const response =
            await propertiesService.updatePropertyVerificationStatus({
              property_id: propertyId,
              action: action,
            })

          if (response.success) {
            notification.success({
              message: 'Status Updated',
              description: response.message,
            })
            fetchProperties()
          } else {
            throw new Error(response.error || 'Failed to update status')
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: error.message || 'Failed to update property status',
          })
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '30%',
      render: (address) => (
        <Tooltip
          title={`${address.street_address}, ${address.city}, ${address.state} ${address.zip_code}`}
        >
          <span>{`${address.street_address}, ${address.city}, ${address.state} ${address.zip_code}`}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Rent',
      dataIndex: 'rent',
      key: 'rent',
      width: '15%',
      render: (rent) => `$${rent.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status_verification',
      key: 'status',
      width: '15%',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space>
          {record.status_verification ===
            STATUS_VERIFICATION_PROPERTY_SUBMITTED && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'approve')}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'deny')}
              >
                Reject
              </Button>
            </>
          )}
          {record.status_verification !==
            STATUS_VERIFICATION_PROPERTY_SUBMITTED && (
            <Tooltip title="Only pending properties can be approved or rejected">
              <InfoCircleOutlined style={{ color: '#999' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  const filteredProperties = propertyListing.filter(
    (property) =>
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(property.status_verification)
  )

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Title level={4}>Property Verification Requests</Title>

        <div>
          <Checkbox.Group
            options={statusFilters}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredProperties}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} properties`,
          }}
          scroll={{ x: 1000 }}
        />
      </Space>
    </Card>
  )
}

export default PropertyVerificationTable
