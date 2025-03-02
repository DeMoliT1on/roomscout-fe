import styled from 'styled-components'

export const verticalFlex = {
  display: 'flex',
  flexDirection: 'column', // Correct camel case
}

export const horizontalFlex = {
  display: 'flex',
  flexDirection: 'row', // Correct camel case
}

export const FlexEnd = styled.div`
  ${verticalFlex}
  align-items: flex-end;
`

export const FlexLinear = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const CTAS = {
  marginRight: '10px',
}

export const ScrollablePageContent = styled.div`
  max-height: calc(100vh - 200px);
  min-height: 25vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px; /* Adds padding for scrollable content */
  background: rgba(255, 255, 255, 0.8); /* Subtle white background */
  backdrop-filter: blur(10px);
  border-radius: 12px; /* Rounded corners */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Light shadow for elevation */
`
