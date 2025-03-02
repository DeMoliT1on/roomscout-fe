import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Carousel,
  Typography,
  Divider,
  Tag,
  List,
  Empty,
  Spin,
  Pagination,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  HomeOutlined,
  DollarOutlined,
  BankOutlined,
  HeartOutlined,
  HeartFilled,
  ExportOutlined,
} from '@ant-design/icons'
import propertiesService from 'src/apis/propertiesService'
import { range } from 'src/utils/utils'
import { App } from 'antd'
import { message } from 'antd'
import { useSelector } from 'react-redux'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

const PropertySearch = () => {
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form] = Form.useForm()
  const user = useSelector((state) => state.auth.user)
  const { notification } = App.useApp()

  const fetchProperties = async (values) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await propertiesService.searchProperties(values)

      if (response.success) {
        let filteredProperties = response.data.properties.filter(
          (property) =>
            !property.is_deleted && property.status_verification === 3
        )

        console.log(filteredProperties)

        if (values.min_rent) {
          filteredProperties = filteredProperties.filter(
            (property) => property.details.rent >= values.min_rent
          )
        }

        if (values.max_rent) {
          filteredProperties = filteredProperties.filter(
            (property) => property.details.rent <= values.max_rent
          )
        }

        setProperties(filteredProperties)
        setTotalCount(response.data.total_count)
      } else {
        setError(response.message)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const values = form.getFieldsValue()
    fetchProperties({ ...values, page: 1, per_page: pageSize })
  }, [])

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1)
      const values = form.getFieldsValue()
      fetchProperties({ ...values, page: 1, per_page: newPageSize })
    } else {
      setCurrentPage(page)
      const values = form.getFieldsValue()
      fetchProperties({ ...values, page, per_page: pageSize })
    }
  }

  const onFinish = (values) => {
    setCurrentPage(1)
    fetchProperties({ ...values, page: 1, per_page: pageSize })
  }

  const toggleWishlist = async (property) => {
    const requestObj = {
      property_id: property.id,
      lessee_id: user.userId,
    }
    const response = await propertiesService.addToWishlist(requestObj)
    if (response.success) {
      notification.success({
        message: 'Success',
        description: response.data.message,
      })
      setProperties((prevProperties) =>
        prevProperties.map((p) =>
          p.id === property.id ? { ...p, isInWishlist: !p.isInWishlist } : p
        )
      )
    } else {
      notification.error({
        message: 'Error',
        description: response.data.message,
      })
    }
  }

  return (
    <Layout style={{ background: 'transparent', minHeight: '100vh' }}>
      <Row justify="space-between" style={{ padding: '24px 24px 0' }}>
        <Col>
          <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
            Property Search
          </Title>
        </Col>
      </Row>

      <Content style={{ padding: '20px' }}>
        <Card>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[
                    { required: true, message: 'Please enter a location' },
                  ]}
                  initialValue={'10001'}
                >
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Enter location"
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="radius"
                  label="Radius (km)"
                  rules={[{ required: true, message: 'Please enter a radius' }]}
                  initialValue={5}
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="min_rent" label="Min Rent">
                  <InputNumber
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="max_rent" label="Max Rent">
                  <InputNumber
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="bedrooms" label="Bedrooms">
                  <Select placeholder="Select bedrooms" allowClear>
                    {range(5).map((num) => (
                      <Option key={num} value={num}>
                        {num}+ bd
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="bathrooms" label="Bathrooms">
                  <Select placeholder="Select bathrooms" allowClear>
                    {range(5).map((num) => (
                      <Option key={num} value={num}>
                        {num}+ ba
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="property_type" label="Property Type">
                  <Select placeholder="Select property type" allowClear>
                    <Option value="apartment">Apartment</Option>
                    <Option value="house">House</Option>
                    <Option value="condo">Condo</Option>
                    <Option value="studio">Studio</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sort_by" label="Sort By">
                  <Select placeholder="Sort by">
                    <Option value="rent_asc">Rent: Low to High</Option>
                    <Option value="rent_desc">Rent: High to Low</Option>
                    <Option value="date_desc">Newest First</Option>
                    <Option value="date_asc">Oldest First</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search Properties
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Divider />

        <Spin spinning={isLoading}>
          {error && <Text type="danger">{error}</Text>}
          {properties.length === 0 && !isLoading ? (
            <Empty description="No properties found" />
          ) : (
            <List
              grid={{ gutter: 20, column: 1 }}
              dataSource={properties}
              renderItem={(property) => (
                <List.Item>
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
                          ${property.details.rent}/month
                        </Text>
                        <Tooltip title="Add to wishlist">
                          <Button
                            type="text"
                            icon={
                              property.isInWishlist ? (
                                <HeartFilled
                                  style={{
                                    fontSize: '20px',
                                    color: '#ff4d4f',
                                  }}
                                />
                              ) : (
                                <HeartOutlined
                                  style={{
                                    fontSize: '20px',
                                    color: '#d9d9d9',
                                  }}
                                />
                              )
                            }
                            onClick={() => toggleWishlist(property)}
                          />
                        </Tooltip>
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

                      <div style={{ marginTop: '10px' }}>
                        <Tag color="blue">
                          {property.distance.toFixed(2)} km away
                        </Tag>
                      </div>

                      <div
                        style={{
                          marginTop: '15px',
                          display: 'flex',
                          gap: '10px',
                        }}
                      >
                        <Tooltip title="This will lead you to property page for more details and functionalities">
                          <Button
                            icon={<ExportOutlined />}
                            onClick={() =>
                              navigate(`/property?id=${property?.id}`)
                            }
                          >
                            View Property Page
                          </Button>
                        </Tooltip>
                      </div>
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
                x
                pageSizeOptions={[10, 30, 50, 100]}
                showSizeChanger
              />
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  )
}

export default PropertySearch
