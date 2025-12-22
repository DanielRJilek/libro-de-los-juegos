import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import routes from './routes'
import App from './App'
import authContext from './context/AuthContext'
import useAuthContext from './hooks/useAuthContext'
import AuthProvider from './context/AuthContext'

const router = createBrowserRouter(routes);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
          <App/>
      </RouterProvider>
    </AuthProvider>
  // </StrictMode>
);

