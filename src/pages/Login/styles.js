import styled from 'styled-components'
import { verticalFlex } from 'src/global-styles/utils'

export const LoginWrapper = styled.div`
  background: linear-gradient(
    135deg,
    #b0dde7,
    #eaf9fe
  ); /* Lighter, softer gradient */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px; /* Adds spacing for small screens */
`

export const LoginContainer = styled.div`
  ${verticalFlex}
  width: 400px; /* Consistent width */
  box-shadow: 0px 16px 40px rgba(0, 0, 0, 0.15); /* Softer shadow */
  border-radius: 20px; /* Rounded corners for a modern feel */
  overflow: hidden;
  height: auto;
  backdrop-filter: blur(18px) saturate(180%); /* Enhanced glassmorphism effect */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8),
    rgba(235, 245, 255, 0.6)
  ); /* Subtle and light */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Glass-like border */
  padding: 25px 30px; /* Increased padding for spacing */
`

export const TitleContainer = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 35px;
  padding: 20px 0;
  color: #0a3d62; /* Soft, contrasting color */
  background: none; /* Remove background color */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Subtle border */
`

export const TabPane = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;

  .ant-input-outlined {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 8px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

    .ant-input {
      padding: none;
    }

    &:autofill,
    &:autofill:hover,
    &:autofill:focus {
      background: rgba(255, 255, 255, 0.7) !important;
      box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.7) inset !important;
      color: inherit !important;
    }
  }

  button {
    background: linear-gradient(135deg, #10a3c2, #66c5d8);
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0px 4px 12px rgba(16, 163, 194, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #0e8ca8, #54b3c6);
      box-shadow: 0px 6px 16px rgba(16, 163, 194, 0.5);
    }
  }
`

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  img {
    width: 80px; /* Adjust the size of the logo */
    height: auto;
  }

  h1 {
    margin: 10px 0 0;
    font-size: 24px;
    font-weight: bold;
    color: #003952; /* Darker shade to contrast with the light background */
    text-align: center;
  }
`
