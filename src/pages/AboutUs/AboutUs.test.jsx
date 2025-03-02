import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test, it } from 'vitest'
import AboutPage from './index'

describe('AboutPage', () => {
  test('renders hero section with title and description', () => {
    render(<AboutPage userRole="lessee" />)
    expect(screen.getByText('Welcome to RoomScout')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Your trusted platform for connecting students and landlords.'
      )
    ).toBeInTheDocument()
  })

  test('renders What We Do card', () => {
    render(<AboutPage userRole="lessee" />)
    expect(screen.getByText('What We Do')).toBeInTheDocument()
    expect(
      screen.getByText(
        'RoomScout bridges the gap between students and landlords, offering a seamless rental experience for both parties.'
      )
    ).toBeInTheDocument()
  })

  test('renders Why Choose Us card', () => {
    render(<AboutPage userRole="lessee" />)
    expect(screen.getByText('Why Choose Us')).toBeInTheDocument()
    expect(
      screen.getByText(
        'We prioritize safety, transparency, and convenience, ensuring you can find or list properties with confidence.'
      )
    ).toBeInTheDocument()
  })

  test('renders Who We Serve card', () => {
    render(<AboutPage userRole="lessee" />)
    expect(screen.getByText('Who We Serve')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Students seeking safe housing and landlords looking for reliable tenants.'
      )
    ).toBeInTheDocument()
  })
})
