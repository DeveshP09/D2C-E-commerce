import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layout/App-layout'
import { ErrorLayout } from '../layout/Error-layout'
import { ROUTE_PATHS } from '../constants/routes'
import { productRoutes } from '../pages/product/routes'
import { categoryRoutes } from '../pages/categories/routes'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorLayout />,
    children: [
      ...productRoutes,
      ...categoryRoutes,
      { path: ROUTE_PATHS.notFound, element: <ErrorLayout /> },
    ],
  },
])
