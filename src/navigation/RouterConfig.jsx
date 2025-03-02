import { AuthProvider } from 'src/components/AuthProvider'
import { openRouteList } from './routeLists'
import OpenRoutesLayout from 'src/components/OpenRoutesLayout'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from 'src/components/AuthProvider/ProtectedRoute'
import LayoutContainer from 'src/components/LayoutContainer'

const RouterConfig = () => {
  return (
    <AuthProvider>
      <Routes>
        {openRouteList.map((o) => {
          return (
            <Route
              key={o.key}
              path={o.path}
              element={
                <OpenRoutesLayout Component={o.component} props={o.props} />
              }
            />
          )
        })}
        <Route
          key={'app'}
          path="/*"
          element={
            <ProtectedRoute>
              <LayoutContainer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default RouterConfig
