import './index.css'
import useAuthContext from './hooks/useAuthContext'
// import AuthProvider from './context/AuthContext'
import routes from './routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContext } from './context/AuthContext'
import { useContext, useState } from 'react'

function App() {
  // const {user} = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const setCredentials = (accessToken) => {
    setToken(accessToken);
  }
  const logOut = () => {
    setToken(null);
  }
  
  const router = createBrowserRouter(routes);
  return (
    <AuthContext value={{token, setCredentials, logOut}}>
      <RouterProvider router={router}>
          <App/>
      </RouterProvider>
    </AuthContext>
  )
}

export default App

