import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import './index.css'
import routes from './routes'
import App from './App'

const router = createBrowserRouter(routes);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router}>
        <App/>
    </RouterProvider>
  // </StrictMode>
);

