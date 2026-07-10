import './index.css'
import routes from './routing/routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContextProvider } from './context/AuthContext'
import { UserContextProvider } from './context/UserContext'
import { ServerStatusProvider } from './context/ServerStatusContext'
import SocketSession from './components/SocketSession/SocketSession'
import { MusicProvider } from './context/MusicContext'

const router = createBrowserRouter(routes);

function App() {
  return (
    <MusicProvider>
      <AuthContextProvider>
        <ServerStatusProvider>
          <UserContextProvider>
            <SocketSession />
            <RouterProvider router={router} />
          </UserContextProvider>
        </ServerStatusProvider>
      </AuthContextProvider>
    </MusicProvider>
  )
}

export default App
