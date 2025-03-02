import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Input,
  Button,
  Row,
  Col,
  Form,
  Select,
  Flex,
  Modal,
  Alert,
  Steps,
  Checkbox,
  Upload,
  DatePicker,
  Empty,
  InputNumber,
  List,
  Tag,
  Carousel,
  Divider,
  Tooltip,
  Typography,
  Layout,
  Pagination,
} from 'antd'

import Icon, {
  PlusOutlined,
  PictureOutlined,
  LoadingOutlined,
  ReloadOutlined,
  AuditOutlined,
  EditOutlined,
  ExportOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'

import { useEffect } from 'react'
import propertiesService from 'src/apis/propertiesService'
import { CTAS, ScrollablePageContent } from 'src/global-styles/utils'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { App } from 'antd'
import { Spin } from 'antd'
import { Image } from 'antd'
import { range } from 'src/utils/utils'
import {
  addPropertyModalDescription,
  amenitiesList,
  propertyTypes,
  states,
  steps,
} from './constants'

import '../../index.css'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { Dragger } = Upload

export const STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED = 0
export const STATUS_VERIFICATION_PROPERTY_SUBMITTED = 1
export const STATUS_VERIFICATION_PROPERTY_DENIED = 2
export const STATUS_VERIFICATION_PROPERTY_VERIFIED = 3

const AddProperty = () => {
  const navigate = useNavigate()

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const [addProperyModalCurrentStep, setAddProperyModalCurrentStep] =
    useState(0)

  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  const [form] = useForm()
  const [fileList, setFileList] = useState([])
  const { notification } = App.useApp()
  const [isLoading, setLoading] = useState(false)
  const [propertyListing, setPropertyListing] = useState([])
  const [initialValues, setInitialValues] = useState(null)
  const [isEdit, setIdEdit] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const getStatusTag = (status) => {
    const tagStyle = {
      fontSize: '14px', // Increase font size
      fontWeight: 'bold', // Optional for better visibility
      padding: '5px 10px', // Adjust padding for better appearance
      borderRadius: '5px', // Rounded corners for a modern look
    }
    switch (status) {
      case STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED:
        return (
          <Tag
            color="orange"
            icon={<ExclamationCircleOutlined />}
            style={tagStyle}
          >
            Not Submitted for Verification
          </Tag>
        )
      case STATUS_VERIFICATION_PROPERTY_SUBMITTED:
        return (
          <Tag color="blue" icon={<SyncOutlined />} style={tagStyle}>
            Submitted for Verification
          </Tag>
        )
      case STATUS_VERIFICATION_PROPERTY_DENIED:
        return (
          <Tag color="red" icon={<CloseCircleOutlined />} style={tagStyle}>
            Verification Denied
          </Tag>
        )
      case STATUS_VERIFICATION_PROPERTY_VERIFIED:
        return (
          <Tag color="green" icon={<CheckCircleOutlined />} style={tagStyle}>
            Verified
          </Tag>
        )
      default:
        return null
    }
  }

  const handleAddPropertyModalOpen = (isEdit, initialValues) => {
    setIdEdit(isEdit)
    form.resetFields()

    if (isEdit && initialValues) {
      const existingFileList = initialValues.images.map((item) => {
        return {
          uid: item.id,
          name: item.file_name,
          url: item.url,
          status: 'done',
        }
      })
      setFileList(existingFileList)
    } else {
      setFileList([])
    }
    setIsAddPropertyModalOpen(true)
  }

  const handleAddPropertyModalClose = () => {
    setAddProperyModalCurrentStep(0)
    setIsAddPropertyModalOpen(false)
  }

  useEffect(() => {
    getPropertyListings({
      page: 1,
      per_page: pageSize,
    })
  }, [pageSize])

  const getPropertyListings = async (requestObj) => {
    setLoading(true)
    try {
      const res = await propertiesService.getMyListings(requestObj)
      if (res.success) {
        const activeProperties = res.data.properties.filter(
          (property) => !property.is_deleted
        )
        setPropertyListing(activeProperties)
        setTotalCount(res.data.total_count)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (file) => {
    setFileList((prevList) =>
      prevList.map((item) =>
        item.uid === file.uid
          ? { ...item, status: item.url ? 'removed' : 'ignored' }
          : item
      )
    )

    form.validateFields(['media'])
    return false
  }

  const visibleFileList = fileList.filter(
    (file) => file.status !== 'removed' && file.status !== 'ignored'
  )

  const handleUploadChange = ({ file }) => {
    setFileList([
      ...fileList,
      { uid: file.uid, status: 'new', originFileObj: file, name: file.name },
    ])
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const onFinish = () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue(true)
      const requestObj = {
        ...formValues,
        available_since: formValues.available_since.format('YYYY-MM-DD'),
        amenities: amenitiesList.reduce((acc, amenity) => {
          acc[amenity.value] = formValues.amenities.includes(amenity.value)
          return acc
        }, {}),
      }
      const filesToDelete = fileList.filter((file) => file.status === 'removed')
      const filesToUpload = fileList.filter((file) => file.status === 'new')

      if (isEdit) {
        setLoading(true)
        const res = await propertiesService.updatePropertyApi({
          ...requestObj,
          property_id: initialValues.id,
        })
        if (res.success) {
          const propertyId = initialValues.id
          const formData = new FormData()
          formData.append('property_id', propertyId)
          filesToUpload.forEach((file) => {
            formData.append('new_images', file.originFileObj)
          })
          formData.append(
            'deleted_images',
            JSON.stringify(filesToDelete.map((file) => file.uid))
          )
          const uploadRes = await propertiesService.propertyUploadImage(
            formData
          )
          if (uploadRes.success) {
            notification.success({
              message: 'Property Updated',
              description: 'Successfully updated property to listing',
            })
            form.resetFields()
            handleAddPropertyModalClose()
            setAddProperyModalCurrentStep(0)
            getPropertyListings({ page: currentPage, per_page: pageSize })
          }
        }
        setLoading(false)
      } else {
        setLoading(true)
        const res = await propertiesService.listPropertyApi(requestObj)
        if (res.success) {
          const propertyId = res.data.property_id
          const formData = new FormData()
          formData.append('property_id', propertyId)
          filesToUpload.forEach((file) => {
            formData.append('new_images', file.originFileObj)
          })
          formData.append(
            'deleted_images',
            JSON.stringify(filesToDelete.map((file) => file.url))
          )
          const uploadRes = await propertiesService.propertyUploadImage(
            formData
          )
          if (uploadRes.success) {
            notification.success({
              message: 'Property Added',
              description: 'Successfully added property to listing',
            })
            form.resetFields()
            handleAddPropertyModalClose()
            setAddProperyModalCurrentStep(0)
            getPropertyListings({ page: currentPage, per_page: pageSize })
          } else {
            notification.error({
              message: 'Action Failed',
              description: uploadRes.message,
            })
          }
        } else {
          notification.error({
            message: 'Action Failed',
            description: res.message,
          })
        }
        setLoading(false)
      }
    })
  }

  const validateFields = () => {
    form.validateFields().then(async (values) => {
      if (!isEdit && addProperyModalCurrentStep === 0) {
        const requestObj = {
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
        }
        setLoading(true)
        const response = await propertiesService.validateAddress(requestObj)
        setLoading(false)
        if (response.success && response.data.legit) {
          setAddProperyModalCurrentStep(addProperyModalCurrentStep + 1)
        } else {
          notification.error({
            message: 'Invalid Address',
            description: 'Please provide a valid address',
          })
          return
        }
      }
      setAddProperyModalCurrentStep(addProperyModalCurrentStep + 1)
    })
  }

  const handleSubmitForVerification = async (propertyId) => {
    try {
      const response = await propertiesService.submitPropertyForVerification(
        propertyId
      )
      if (response?.success) {
        notification.success({
          message: 'Success',
          description: response.message,
        })
        getPropertyListings({ page: currentPage, per_page: pageSize })
      } else {
        notification.error({
          message: 'Error',
          description: response?.error || 'Something went wrong!',
        })
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred!',
      })
    }
  }

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setCurrentPage(1)
      getPropertyListings({ page: 1, per_page: newPageSize })
    } else {
      setCurrentPage(page)
      getPropertyListings({ page, per_page: pageSize })
    }
  }

  const handleRemoveClick = async (item) => {
    Modal.confirm({
      title: 'Remove Property',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to remove this property?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        setLoading(true)
        try {
          const response = await propertiesService.deleteProperty(item.id)

          if (response?.success) {
            notification.success({
              message: 'Property Removed',
              description: 'Successfully removed property from listing',
            })
            getPropertyListings({ page: currentPage, per_page: pageSize })
          } else {
            notification.error({
              message: 'Action Failed',
              description: response?.message || 'Failed to remove property',
            })
          }
        } catch (error) {
          notification.error({
            message: 'Action Failed',
            description: 'An error occurred while removing the property',
          })
          console.error('Delete property error:', error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div>
      <>
        <Modal
          title={isEdit ? 'Modify your property' : `Adding your Property`}
          open={isAddPropertyModalOpen}
          onClose={handleAddPropertyModalClose}
          onCancel={handleAddPropertyModalClose}
          width={'150vh'}
          destroyOnClose={true}
          centered
          footer={[
            addProperyModalCurrentStep !== 0 ? (
              <Button
                key="back"
                onClick={() => {
                  setAddProperyModalCurrentStep(addProperyModalCurrentStep - 1)
                }}
                htmlType="submit"
                className="button"
              >{`Previous`}</Button>
            ) : (
              <></>
            ),
            addProperyModalCurrentStep === 3 ? (
              <Button
                key="next"
                type="primary"
                onClick={onFinish}
                htmlType="submit"
                className="button"
              >
                {isEdit ? 'Update' : `Save`}
              </Button>
            ) : (
              <Button
                key="next"
                htmlType="submit"
                className="button"
                type="primary"
                onClick={() => {
                  validateFields()
                }}
              >
                {`Next`}
              </Button>
            ),
          ]}
        >
          <Spin
            spinning={isLoading}
            indicator={<LoadingOutlined spin />}
            size="large"
          >
            <ScrollablePageContent>
              <br />
              <Alert message={addPropertyModalDescription} type="warning" />
              <br />

              <Steps
                current={addProperyModalCurrentStep}
                items={items}
                progressDot
                style={{ marginTop: '5vh', marginBottom: '2vh' }}
              />

              <div
                style={{
                  padding: '20px',
                  minHeight: '45vh',
                }}
              >
                <Form layout="vertical" variant="filled" form={form}>
                  {addProperyModalCurrentStep === 0 && (
                    <>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter a title',
                              },
                            ]}
                            initialValue={isEdit ? initialValues.title : ''}
                          >
                            <Input
                              placeholder="Title"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Rent"
                            name="rent"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter a rent',
                              },
                            ]}
                            initialValue={isEdit ? initialValues.rent : ''}
                          >
                            {/* make this input a numerical field */}
                            <InputNumber
                              placeholder="Rent"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Location Fields */}
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="street_address"
                            label="Location"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter a street address',
                              },
                            ]}
                            initialValue={
                              isEdit ? initialValues.address.street_address : ''
                            }
                            disabled={
                              isEdit &&
                              initialValues.status_verification ===
                                STATUS_VERIFICATION_PROPERTY_VERIFIED
                            }
                          >
                            <Input
                              placeholder="Street Address"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            name="city"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter city',
                              },
                            ]}
                            initialValue={
                              isEdit ? initialValues.address.city : ''
                            }
                          >
                            <Input
                              placeholder="City"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="state"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter state',
                              },
                            ]}
                            initialValue={'NY'}
                          >
                            <Select disabled={true}>
                              {states.map((item) => (
                                <Option key={item.value} value={item.value}>
                                  {item.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="zip_code"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter a zipcode',
                              },
                              {
                                pattern: /^[0-9]\d{4}$/,
                                message: 'Please enter valid zipcode',
                              },
                            ]}
                            initialValue={
                              isEdit ? initialValues.address.zip_code : ''
                            }
                          >
                            <Input
                              placeholder="Zip Code"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Property Type and Room Information */}
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            label="Property Type"
                            name="property_type"
                            rules={[
                              {
                                required: true,
                                message: 'Please select a property type',
                              },
                            ]}
                            initialValue={
                              isEdit ? initialValues.details.property_type : ''
                            }
                          >
                            <Select
                              placeholder="Select type of property"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            >
                              {propertyTypes.map((item) => (
                                <Option key={item?.value} value={item?.value}>
                                  {item?.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label="Number of Bedrooms"
                            name="bedrooms"
                            rules={[
                              {
                                required: true,
                                message: 'Please select the number of bedrooms',
                              },
                            ]}
                            initialValue={
                              isEdit ? initialValues.details.bedrooms : ''
                            }
                          >
                            <Select
                              placeholder="Select number of bedrooms"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            >
                              {range(5).map((item) => (
                                <Option key={item} value={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label="Number of Bathrooms"
                            name="bathrooms"
                            rules={[
                              {
                                required: true,
                                message:
                                  'Please select the number of bathrooms',
                              },
                            ]}
                            initialValue={
                              isEdit ? initialValues.details.bathrooms : ''
                            }
                          >
                            <Select
                              placeholder="Select number of bathrooms"
                              disabled={
                                isEdit &&
                                initialValues.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_VERIFIED
                              }
                            >
                              {range(5).map((item) => (
                                <Option key={item} value={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                  {addProperyModalCurrentStep === 1 && (
                    <>
                      <Form.Item
                        label="Property Description"
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter a description',
                          },
                        ]}
                        initialValue={
                          isEdit ? initialValues.details.description : ''
                        }
                      >
                        <TextArea
                          rows={4}
                          placeholder="Describe the property, unique features, nearby attractions, etc."
                          maxLength={255}
                          disabled={isEdit}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Amenities"
                        name="amenities"
                        initialValue={
                          isEdit
                            ? Object.entries(initialValues.amenities)
                                .filter(
                                  ([key, value]) =>
                                    key !== 'property_id' && value === true
                                )
                                .map(([key]) => key)
                            : []
                        }
                      >
                        <Checkbox.Group style={{ width: '100%' }}>
                          <Row gutter={16}>
                            {amenitiesList.map((amenity) => (
                              <Col span={8}>
                                <Checkbox
                                  key={amenity?.value}
                                  value={amenity?.value}
                                >
                                  {amenity?.label}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      </Form.Item>
                    </>
                  )}
                  {addProperyModalCurrentStep === 2 && (
                    <>
                      <Form.Item
                        label="Media Upload"
                        name="media"
                        rules={[
                          {
                            message: 'Maximum 3 images can only be uploaded',
                            validator: () => {
                              if (visibleFileList.length < 4)
                                return Promise.resolve()
                              return Promise.reject()
                            },
                          },
                        ]}
                      >
                        <Dragger
                          fileList={visibleFileList}
                          onRemove={handleRemove}
                          onChange={handleUploadChange}
                          beforeUpload={() => false}
                          listType="picture-card"
                          onPreview={handlePreview}
                        >
                          <p className="ant-upload-drag-icon">
                            <PictureOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                          </p>
                        </Dragger>
                      </Form.Item>
                      {previewImage && (
                        <Image
                          wrapperStyle={{
                            display: 'none',
                          }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(''),
                          }}
                          src={previewImage}
                        />
                      )}
                    </>
                  )}
                  {addProperyModalCurrentStep === 3 && (
                    <>
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            label="Available Since"
                            name="available_since"
                            rules={[
                              {
                                required: true,
                                message: 'Please enter a date',
                              },
                            ]}
                            initialValue={
                              isEdit ? dayjs(initialValues.available_since) : ''
                            }
                          >
                            <DatePicker
                              style={{ minWidth: '80%' }}
                              minDate={dayjs()}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Is Guarantor Required?"
                            name="guarantor_required"
                            rules={[
                              {
                                required: true,
                                message: 'Please provide a response',
                              },
                            ]}
                            initialValue={
                              isEdit
                                ? initialValues.details.guarantor_required
                                : null
                            }
                          >
                            <Select
                              style={{ minWidth: '80%' }}
                              options={[
                                {
                                  value: true,
                                  label: 'Yes',
                                },
                                {
                                  value: false,
                                  label: 'No',
                                },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            label="Any terms/conditions/additional notes?"
                            name="miscellaneous_text"
                            initialValue={
                              isEdit ? initialValues.addtional_notes : ''
                            }
                          >
                            <TextArea rows={4} placeholder="" maxLength={255} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
              </div>
            </ScrollablePageContent>
          </Spin>
        </Modal>
        <Row justify="space-between">
          <Col>
            <Title level={3} style={{ margin: 0, fontWeight: 'bold' }}>
              Your Properties
            </Title>
          </Col>
          <Col>
            <Button
              onClick={() => handleAddPropertyModalOpen(false)}
              icon={<PlusOutlined />}
              type="primary"
              htmlType="submit"
              className="button"
            >
              {`Add a Property`}
            </Button>
          </Col>
        </Row>
        <Divider></Divider>

        {/* <Layout marginTop="10px"> */}
        <Layout
          style={{
            background: 'transparent', // Make Layout background transparent
            minHeight: '100vh', // Ensure it covers the entire viewport height
          }}
        >
          <Spin
            spinning={isLoading}
            indicator={<LoadingOutlined spin />}
            size="large"
          >
            {propertyListing.length === 0 && (
              <Empty description="No properties found" />
            )}
            {propertyListing.length !== 0 && (
              <List grid={{ gutter: 20, column: 1 }}>
                {propertyListing.map((item) => {
                  return (
                    <List.Item>
                      <div
                        class="glass"
                        style={{
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* Property Image Carousel */}
                        <Carousel
                          arrows={true}
                          style={{
                            width: '450px',
                            height: '300px',
                            padding: '0',
                          }}
                        >
                          {item.images && item.images.length > 0 ? (
                            item.images.map((image, index) => (
                              <div key={index}>
                                <img
                                  src={image.url}
                                  alt={`Property image ${index + 1}`}
                                  style={{
                                    width: '450px',
                                    height: '300px',
                                    objectFit: 'cover', // Ensures the image scales nicely
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
                                }}
                              />
                            </div>
                          )}
                        </Carousel>
                        {/* Property Details */}
                        <div style={{ flex: 1, marginLeft: '20px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            {/* Rent and Title */}
                            <Text strong style={{ fontSize: '24px' }}>
                              ${item.rent}/month
                            </Text>

                            {getStatusTag(item.status_verification)}
                          </div>

                          {/* Address */}
                          <div style={{ marginTop: '10px' }}>
                            <Text
                              style={{
                                fontSize: '15px',
                                display: 'block',
                              }}
                            >
                              {item.title} 📍 {item.address.street_address},{' '}
                              {item.address.city}, {item.address.state},{' '}
                              {item.address.zip_code}
                            </Text>
                          </div>

                          {/* Bedrooms and Bathrooms */}
                          <div style={{ marginTop: '10px' }}>
                            <Text
                              style={{
                                fontSize: '15px',
                                display: 'block',
                              }}
                            >
                              🛏️ {item.details.bedrooms} bd • 🛁{' '}
                              {item.details.bathrooms} ba
                            </Text>
                          </div>

                          {/* Description */}
                          <div style={{ marginTop: '10px' }}>
                            <Text style={{ fontSize: '15px' }}>
                              {item.details.description ||
                                'No Description Available'}
                            </Text>
                          </div>

                          {/* Action Buttons */}
                          <div
                            style={{
                              marginTop: '15px',
                              display: 'flex',
                              gap: '10px',
                            }}
                          >
                            <Tooltip
                              title={
                                item.status_verification ===
                                STATUS_VERIFICATION_PROPERTY_SUBMITTED
                                  ? 'You cannot edit this property because it is submitted for verification.'
                                  : item.status_verification ===
                                    STATUS_VERIFICATION_PROPERTY_VERIFIED
                                  ? 'You can only edit select fields of a verified property.'
                                  : ''
                              }
                            >
                              <Button
                                icon={<EditOutlined />}
                                disabled={
                                  item.status_verification ===
                                  STATUS_VERIFICATION_PROPERTY_SUBMITTED
                                }
                                onClick={() => {
                                  setInitialValues(item)
                                  handleAddPropertyModalOpen(true, item)
                                }}
                              >
                                Edit
                              </Button>
                            </Tooltip>
                            {item.status_verification ===
                              STATUS_VERIFICATION_PROPERTY_VERIFIED && (
                              <Button
                                icon={<ExportOutlined />}
                                onClick={() => {
                                  window.open(
                                    `/property?id=${item?.id}`,
                                    '_blank'
                                  )
                                }}
                              >
                                View Property Page
                              </Button>
                            )}
                            {item.status_verification ===
                              STATUS_VERIFICATION_PROPERTY_NOT_SUBMITTED && (
                              <Button
                                icon={<AuditOutlined />}
                                onClick={() =>
                                  handleSubmitForVerification(item.id)
                                }
                              >
                                Submit for Verification
                              </Button>
                            )}
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => handleRemoveClick(item)}
                              style={{
                                borderColor: '#ff4d4f',
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )
                })}
              </List>
            )}
          </Spin>

          {propertyListing.length > 0 && (
            <Row justify="end">
              <Col>
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={(page, pageSize) =>
                    handlePageChange(page, pageSize)
                  }
                  pageSizeOptions={[10, 30, 50, 100]}
                  showSizeChanger={true}
                />
              </Col>
            </Row>
          )}
        </Layout>
      </>
    </div>
  )
}

export default AddProperty
