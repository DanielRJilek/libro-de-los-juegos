import './index.css'
import authContext from './context/AuthContext'
import useAuthContext from './hooks/useAuthContext'

function App() {
  const {user} = useAuthContext(authContext);
}

export default App

