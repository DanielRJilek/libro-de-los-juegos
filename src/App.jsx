import './index.css'
import useAuthContext from './hooks/useAuthContext'
// import AuthProvider from './context/AuthContext'
import routes from './routing/routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContext, AuthContextProvider } from './context/AuthContext'
import { useContext, useState } from 'react'
import { UserContext } from './context/UserContext'
import { UserContextProvider } from './context/UserContext'

function App() {
  const user = useContext(AuthContext);
  const username = useContext(UserContext)
  
  const router = createBrowserRouter(routes);
  return (
    <AuthContextProvider value={user}>
      <UserContextProvider value={username}>
        <RouterProvider router={router}>
          <App/>
      </RouterProvider>
      </UserContextProvider>
    </AuthContextProvider>
  )
}

export default App

