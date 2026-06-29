import './index.css'
import routes from './routing/routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContextProvider } from './context/AuthContext'
import { UserContextProvider } from './context/UserContext'
import { ServerStatusProvider } from './context/ServerStatusContext'
import SocketSession from './components/SocketSession/SocketSession'

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthContextProvider>
      <ServerStatusProvider>
        <UserContextProvider>
          <SocketSession />
          <RouterProvider router={router} />
        </UserContextProvider>
      </ServerStatusProvider>
    </AuthContextProvider>
  )
}

export default App
