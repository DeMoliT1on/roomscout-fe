import React, { useEffect } from 'react'
import { useSelector } from 'react-redux' // Assuming you're using Redux
import { useNavigate } from 'react-router-dom' // React Router's navigate hook
import { UserRoles } from 'src/utils/enum' // Assuming your user roles are stored here

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user) // Access user from Redux store
  const navigate = useNavigate() // Hook to programmatically navigate

  useEffect(() => {
    // Redirect based on user role when the component mounts
    if (user?.role) {
      switch (user.role) {
        case UserRoles.Lessee:
          navigate('/search-properties') // Navigate to Search Properties
          break
        case UserRoles.Lessor:
          navigate('/properties') // Navigate to Add Property
          break
        case UserRoles.VerificationSupport:
          navigate('/property-verifications') // Navigate to Property Verification Requests
          break
        default:
          navigate('/login') // If no role or unknown role, redirect to login
      }
    } else {
      navigate('/login') // If the user is not logged in, redirect to login page
    }
  }, [user, navigate])

  return (
    <div className="dashboard-wrapper">
      <h1>Welcome to the Dashboard</h1>
    </div>
  )
}

export default Dashboard
