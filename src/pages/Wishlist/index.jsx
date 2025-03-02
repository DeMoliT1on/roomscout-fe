import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Row,
  Col,
  Typography,
  Carousel,
  Button,
  Empty,
  List,
  Spin,
  Pagination,
  Modal,
  Checkbox,
  Table,
  Tooltip,
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  HeartFilled,
  LoadingOutlined,
} from '@ant-design/icons'
import propertiesService from 'src/apis/propertiesService'
import { App } from 'antd'
import { useSelector } from 'react-redux'
import { ScrollablePageContent } from 'src/global-styles/utils'

const { Header, Content } = Layout
const { Title, Text } = Typography

const Wishlist = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState([])
  const [isComparisonVisible, setIsComparisonVisible] = useState(false)

  const user = useSelector((state) => state.auth.user)
  const { notification } = App.useApp()

  const fetchWishlistedProperties = async (requestObj) => {
    setIsLoading(true)
    try {
      const response = await propertiesService.getWishlistedProperties(
        requestObj
      )
      if (response.success) {
        setProperties(response.data.properties)
        setTotalCount(response.data.total_count)
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch wishlisted properties',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlistedProperties({ page: 1, per_page: pageSize })
  }, [])

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1)
      fetchWishlistedProperties({ page: 1, per_page: newPageSize })
    } else {
      setCurrentPage(page)
      fetchWishlistedProperties({ page, per_page: pageSize })
    }
  }

  const removeFromWishlist = async (property) => {
    setSelectedForComparison((prev) => prev.filter((p) => p.id !== property.id))
    const requestObj = {
      property_id: property.id,
      lessee_id: user.userId,
    }
    const response = await propertiesService.addToWishlist(requestObj)
    if (response.success) {
      notification.success({
        message: 'Success',
        description: 'Property removed from wishlist',
      })
      if (properties.length === 1 && currentPage !== 1) {
        setCurrentPage(currentPage - 1)
        fetchWishlistedProperties({ page: currentPage - 1, per_page: pageSize })
        return
      }
      fetchWishlistedProperties({ page: currentPage, per_page: pageSize })
    } else {
      notification.error({
        message: 'Error',
        description: 'Failed to remove property from wishlist',
      })
    }
  }

  const togglePropertyComparison = (property) => {
    if (selectedForComparison.some((p) => p.id === property.id)) {
      setSelectedForComparison((prev) =>
        prev.filter((p) => p.id !== property.id)
      )
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison((prev) => [...prev, property])
    } else {
      notification.info({
        message: 'Info',
        description: 'You can only compare up to 3 properties at a time',
      })
    }
  }

  const showComparison = () => {
    if (selectedForComparison.length >= 2) {
      setIsComparisonVisible(true)
    } else {
      notification.info({
        message: 'Info',
        description: 'Please select atleast 2 properties to compare',
      })
    }
  }

  const closeComparison = () => {
    setIsComparisonVisible(false)
  }

  return (
    <Layout style={{ background: 'transparent', minHeight: '100vh' }}>
      <Row justify="space-between" style={{ padding: '24px 24px 0' }}>
        <Col>
          <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
            My Wishlist
          </Title>
        </Col>
      </Row>

      <Content style={{ padding: '20px' }}>
        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
          {properties.length === 0 && !isLoading ? (
            <Empty
              description="No properties in your wishlist"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              grid={{ gutter: 20, column: 1 }}
              dataSource={properties}
              renderItem={(property) => (
                <List.Item key={property.id}>
                  <div
                    className="glass"
                    style={{
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Carousel
                      arrows={true}
                      style={{
                        width: '450px',
                        height: '300px',
                        padding: '0',
                      }}
                    >
                      {property.images.length > 0 ? (
                        property.images.map((image) => (
                          <div key={image.id}>
                            <img
                              src={image.url}
                              alt={property.title}
                              style={{
                                width: '450px',
                                height: '300px',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div>
                          <img
                            src="https://via.placeholder.com/300x200"
                            alt="Placeholder"
                            style={{
                              width: '450px',
                              height: '300px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                    </Carousel>

                    <div style={{ flex: 1, marginLeft: '20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text strong style={{ fontSize: '24px' }}>
                          ${property.rent}/month
                        </Text>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <Text style={{ fontSize: '15px', display: 'block' }}>
                          {property.title} 📍 {property.address.street_address},{' '}
                          {property.address.city}, {property.address.state},{' '}
                          {property.address.zip_code}
                        </Text>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <Text style={{ fontSize: '15px', display: 'block' }}>
                          🛏️ {property.details.bedrooms} bd • 🛁{' '}
                          {property.details.bathrooms} ba • 🏠{' '}
                          {property.details.property_type}
                        </Text>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <Text style={{ fontSize: '15px' }}>
                          {property.details.description}
                        </Text>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '15px',
                        gap: '10px',
                      }}
                    >
                      <Tooltip title="This will lead you to property page for more details and functionalities">
                        <Button
                          onClick={() =>
                            navigate(`/property?id=${property?.id}`)
                          }
                        >
                          View Property Page
                        </Button>
                      </Tooltip>

                      <Tooltip title="Select to compare properties">
                        <Checkbox
                          style={{ marginLeft: '10px' }}
                          checked={selectedForComparison.some(
                            (p) => p.id === property.id
                          )}
                          onChange={() => togglePropertyComparison(property)}
                        />
                      </Tooltip>

                      {selectedForComparison.some(
                        (p) => p.id === property.id
                      ) && (
                        <Button type="primary" onClick={showComparison}>
                          Compare Now
                        </Button>
                      )}

                      <Tooltip title="Remove from wishlist">
                        <Button
                          style={{ marginLeft: '10px' }}
                          type="text"
                          icon={
                            <HeartFilled
                              style={{
                                fontSize: '20px',
                                color: '#ff4d4f',
                              }}
                            />
                          }
                          onClick={() => removeFromWishlist(property)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Spin>

        {properties.length > 0 && (
          <Row justify="end" style={{ marginTop: '20px' }}>
            <Col>
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={pageSize}
                onChange={handlePageChange}
                pageSizeOptions={[10, 30, 50, 100]}
                showSizeChanger
              />
            </Col>
          </Row>
        )}
      </Content>

      <Modal
        open={isComparisonVisible}
        title="Compare Properties"
        footer={null}
        centered
        onCancel={closeComparison}
        width={1000}
      >
        <ScrollablePageContent>
          <Table
            dataSource={[
              {
                key: '1',
                detail: 'Rent',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    `$${property.rent}/month`,
                  ])
                ),
              },
              {
                key: '2',
                detail: 'Address',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    `${property.address.street_address}, ${property.address.city}, ${property.address.state} ${property.address.zip_code}`,
                  ])
                ),
              },
              {
                key: '3',
                detail: 'Bedrooms',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.details.bedrooms,
                  ])
                ),
              },
              {
                key: '4',
                detail: 'Bathrooms',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.details.bathrooms,
                  ])
                ),
              },
              {
                key: '5',
                detail: 'Property Type',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.details.property_type,
                  ])
                ),
              },
              {
                key: '6',
                detail: 'Amenities',
                children: Object.keys(selectedForComparison[0]?.amenities || {})
                  .filter((amenity) => amenity !== 'property_id')
                  .map((amenity, index) => ({
                    key: `6.${index + 1}`,
                    detail: amenity
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase()),
                    ...Object.fromEntries(
                      selectedForComparison.map((property, idx) => [
                        `property${idx + 1}`,
                        property.amenities[amenity] ? (
                          <CheckOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseOutlined style={{ color: 'red' }} />
                        ),
                      ])
                    ),
                  })),
              },
              {
                key: '7',
                detail: 'Points of Interest (POIs)',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.pois
                      .map((poi) => `${poi.poi_name} (${poi.distance})`)
                      .slice(0, 2)
                      .join(', '),
                  ])
                ),
              },
              {
                key: '8',
                detail: 'Available Since',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    new Date(property.available_since).toLocaleDateString(),
                  ])
                ),
              },
              {
                key: '9',
                detail: 'Additional Notes',
                ...Object.fromEntries(
                  selectedForComparison.map((property, index) => [
                    `property${index + 1}`,
                    property.additional_notes,
                  ])
                ),
              },
            ]}
            columns={[
              {
                title: 'Details',
                dataIndex: 'detail',
                key: 'detail',
                fixed: 'left',
                render: (text) => (
                  <span style={{ fontWeight: 600 }}>{text}</span>
                ),
                width: 150,
              },
              ...selectedForComparison.map((property, index) => ({
                title: property.title,
                dataIndex: `property${index + 1}`,
                key: `property${index + 1}`,
                width: 50,
              })),
            ]}
            bordered
            pagination={false}
          />
        </ScrollablePageContent>
      </Modal>
    </Layout>
  )
}

export default Wishlist
