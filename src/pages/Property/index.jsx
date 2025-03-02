import React, { useState, useEffect } from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'

import { useSelector } from 'react-redux'

import {
  Card,
  Carousel,
  List,
  Typography,
  Row,
  Col,
  Divider,
  Descriptions,
  Button,
  Modal,
} from 'antd'

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from '@react-google-maps/api'

import propertiesService from 'src/apis/propertiesService'

import {
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

import axios from 'axios'

const { Title, Text } = Typography

const PropertyDetails = () => {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const property_id = searchParams.get('id') // Access the "id" query parameter

  const user = useSelector((state) => state.auth.user)

  const [property, setProperty] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isInWishlist, setIsInWishlist] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    const fetchPropertyDetails = async (requestObj) => {
      // setLoading(true)
      try {
        const res = await propertiesService.getPropertyListing(requestObj)
        if (res.success) {
          setProperty(res.data)
          setIsInWishlist(res?.data?.details?.is_wishlist)
        }
      } catch (error) {
      } finally {
        // setLoading(false)
      }
    }

    fetchPropertyDetails({ property_id: property_id })
  }, [property_id])

  const [aqi, setAqi] = useState(null)

  const modifyWishlistApi = async () => {
    try {
      const res = await propertiesService.addToWishlist({
        property_id: property_id,
        lessee_id: user?.userId,
      })
    } catch (error) {
    } finally {
      // setLoading(false)
    }
  }

  const toggleWishlist = () => {
    // Add logic to handle adding/removing from wishlist
    modifyWishlistApi()

    setIsInWishlist(!isInWishlist)
  }

  const contactOwner = () => {
    // Add logic to handle contacting the owner
    showModal()
  }

  const renderMarkers = (map, maps) => {
    property?.pois.forEach((poi) => {
      new maps.Marker({
        position: { lat: poi.latitude, lng: poi.longitude },
        map,
        title: poi.poi_name,
      })
    })
  }

  const google_maps_api_key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_maps_api_key, // Replace with your API key
  })

  const mapCenter = {
    lat: property?.pois[0]?.latitude || 40.6101512, // Fallback to first POI latitude
    lng: property?.pois[0]?.longitude || -73.9826471, // Fallback to first POI longitude
  }

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
  }

  const [selectedPoi, setSelectedPoi] = useState(null)

  useEffect(() => {
    const fetchAqi = async () => {
      try {
        const requestBody = {
          location: {
            latitude: property?.address?.latitude,
            longitude: property?.address?.longitude,
          },
        }
        const response = await axios.post(
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${google_maps_api_key}`,
          requestBody
        )
        const aqiData = response.data.indexes.find(
          (index) => index.code === 'uaqi'
        )
        setAqi(aqiData ? aqiData.aqi : 'N/A')
      } catch (error) {
        // notification.error({
        //   message: 'Error',
        //   description: 'Failed to fetch AQI data',
        // })
      }
    }

    fetchAqi()
  }, [property?.address?.latitude, property?.address?.longitude])

  return (
    <div style={{ padding: '20px' }}>
      <Modal
        title="Owner Contacted"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        closable={false}
      >
        <p>
          Owner has been intimated of your interest in the property. They will
          get back in touch with you soon.
        </p>
      </Modal>
      <Card bordered style={{ width: '100%' }}>
        {/* Title */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: '20px' }}
        ></Button>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: '20px' }}
        >
          <Col>
            <Title level={2}>{property?.title}</Title>
            <Text type="secondary">{`${property?.address?.street_address}, ${property?.address?.city}, ${property?.address?.state} ${property?.address?.zip_code}`}</Text>
          </Col>
          {user?.role == 2 ? (
            <Col>
              <Button
                danger
                icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                onClick={toggleWishlist}
                style={{ marginRight: '10px' }}
              >
                {isInWishlist ? `Added to Wishlist` : `Add to Wishlist`}
              </Button>
              <Button type="default" onClick={contactOwner}>
                {`Contact Owner`}
              </Button>
            </Col>
          ) : null}
        </Row>
        <Divider />

        <Row gutter={[16, 16]}>
          {/* Carousel of Images */}
          <Col xs={24} md={8}>
            <Carousel arrows autoplay>
              {property?.images.map((image) => (
                <div key={image.id}>
                  <img
                    src={image.url}
                    alt={property?.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </Col>
          <Col xs={24} md={16}>
            <Descriptions title="Property Details" bordered>
              <Descriptions.Item label="Price">
                ${property?.details.rent}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                {property?.details.property_type}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {property?.description}
              </Descriptions.Item>
              <Descriptions.Item label="Bedrooms">
                {property?.details.bedrooms}
              </Descriptions.Item>
              <Descriptions.Item label="Bathrooms">
                {property?.details.bathrooms}
              </Descriptions.Item>
              <Descriptions.Item label="Guarantor Required">
                {property?.details.guarantor_required ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Available Since">
                {new Date(
                  property?.details.available_since
                ).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Additional Notes">
                {property?.details.additional_notes}
              </Descriptions.Item>
              <Descriptions.Item label="Air Quality Index">
                {aqi !== null ? aqi : 'Loading...'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider />
        {/* Amenities */}
        <Descriptions title="Amenities" bordered>
          <Descriptions.Item label="Air Conditioning">
            {property?.amenities?.air_conditioning ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Parking">
            {property?.amenities?.parking ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Dishwasher">
            {property?.amenities?.dishwasher ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Heating">
            {property?.amenities?.heating ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Gym">
            {property?.amenities?.gym ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Refrigerator">
            {property?.amenities?.refrigerator ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Laundry">
            {property?.amenities?.laundry ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Swimming Pool">
            {property?.amenities?.swimming_pool ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Microwave">
            {property?.amenities?.microwave ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        {/* Points of Interest */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <List
                header={<div>{`Points of Interest`}</div>}
                bordered
                dataSource={property?.pois}
                renderItem={(item) => (
                  <List.Item key={item.id} onClick={() => setSelectedPoi(item)}>
                    <List.Item.Meta
                      title={item.poi_name}
                      description={`Type: ${item.poi_type}, Ratings: ${item.poi_ratings} ⭐️, Distance: ${item.distance}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ height: '300px', width: '100%' }}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={15}
                >
                  {/* Add markers for each POI */}
                  {property?.address && (
                    <Marker
                      position={{
                        lat: property.address.latitude,
                        lng: property.address.longitude,
                      }}
                      title="House"
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      }}
                      onClick={() => setSelectedPoi(property?.address)}
                    />
                  )}
                  {property?.pois.map((poi) => (
                    <Marker
                      key={poi.id}
                      position={{
                        lat: poi.latitude,
                        lng: poi.longitude,
                      }}
                      title={poi.poi_name}
                      onClick={() => setSelectedPoi(poi)}
                    />
                  ))}
                  {/* InfoWindow for selected POI */}

                  {selectedPoi && (
                    <InfoWindow
                      position={{
                        lat: selectedPoi?.latitude,
                        lng: selectedPoi?.longitude,
                      }}
                      onCloseClick={() => setSelectedPoi(null)}
                    >
                      <div>
                        <h4>{selectedPoi?.poi_name}</h4>
                        <p>
                          <strong>Type:</strong> {selectedPoi?.poi_type}
                        </p>
                        <p>
                          <strong>Ratings:</strong> {selectedPoi?.poi_ratings} ⭝
                        </p>
                        <p>
                          <strong>Distance:</strong> {selectedPoi?.distance}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default PropertyDetails
