import React from 'react';
import { Row, Col, Typography, Button, Card, Divider } from 'antd';
import { UserOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AboutPage = ({ userRole }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const roleContent = {
    lessee: {
      title: 'For Students',
      description:
        "As a student, you deserve a home that feels secure and convenient. With RoomScout, you can explore a wide range of verified properties near your campus, equipped with all the amenities you need to thrive.",
      features: [
        'Verified property listings near universities',
        'Transparent pricing and lease terms',
        'Guarantor assistance for international students',
        'User-friendly filters for budget, amenities, and more',
      ],
    },
    lessor: {
      title: 'For Landlords',
      description:
        "RoomScout simplifies the rental process for landlords, helping you connect with students seeking quality housing. Maximize your property’s visibility and ensure timely verification with our seamless platform.",
      features: [
        'Easy property listing management',
        'Wide student audience targeting',
        'Streamlined property verification process',
        'Flexible lease terms for students',
      ],
    },
  };

  const { title, description, features } = roleContent[userRole] || roleContent.lessee;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #C2EAF1, #F4FAFC)', padding: '40px 20px' }}>
      {/* Hero Section */}
      <Row gutter={16} justify="center" align="middle" style={{ textAlign: 'center' }}>
        <Col span={12}>
          <Title level={1} style={{ color: '#0C2A3C' }}>
            Welcome to RoomScout
          </Title>
          <Text style={{ fontSize: '16px', color: '#505A6B' }}>
            Your trusted platform for connecting students and landlords.
           </Text>
        </Col>
      </Row>

      <Divider />

      {/* Common Section: What, Why, Who */}
      <Row gutter={32} style={{ marginTop: '40px' }}>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', height:'300px' }}>
            <UserOutlined style={{ fontSize: '40px', color: '#10A3C2' }} />
            <Title level={3}>What We Do</Title>
            <Text>
              RoomScout bridges the gap between students and landlords, offering a seamless rental experience for both
              parties.
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', height:'300px' }}>
            <HomeOutlined style={{ fontSize: '40px', color: '#10A3C2' }} />
            <Title level={3}>Why Choose Us</Title>
            <Text>
              We prioritize safety, transparency, and convenience, ensuring you can find or list properties with
              confidence.
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', height:'300px' }}>
            <CheckCircleOutlined style={{ fontSize: '40px', color: '#10A3C2' }} />
            <Title level={3}>Who We Serve</Title>
            <Text>
              Students seeking safe housing and landlords looking for reliable tenants.
            </Text>
          </Card>
        </Col>
      </Row>

      <Divider />
    </div>
  );
};

export default AboutPage;