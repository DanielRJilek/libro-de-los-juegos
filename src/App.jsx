import './index.css'
import routes from './routing/routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContext, AuthContextProvider } from './context/AuthContext'
import { UserContext, UserContextProvider } from './context/UserContext'
import { useContext } from 'react'
import SocketSession from './components/SocketSession/SocketSession'

function App() {
  const user = useContext(AuthContext);
  const username = useContext(UserContext)
  
  const router = createBrowserRouter(routes);
  return (
    <AuthContextProvider value={user}>
      <UserContextProvider value={username}>
        <SocketSession />
        <RouterProvider router={router}>
          
        </RouterProvider>
      </UserContextProvider>
    </AuthContextProvider>
  )
}

export default App

