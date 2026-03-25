import './index.css'
import routes from './routing/routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContext, AuthContextProvider } from './context/AuthContext'
import { useContext, useState } from 'react'
import { UserContext, UserContextProvider } from './context/UserContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const user = useContext(AuthContext);
  const username = useContext(UserContext)
  
  const router = createBrowserRouter(routes);
  return (
    <AuthContextProvider value={user}>
      <UserContextProvider value={username}>
        <RouterProvider router={router}>
          
        </RouterProvider>
        <ToastContainer/>
      </UserContextProvider>
    </AuthContextProvider>
  )
}

export default App

