
import { ROUTE_PATHS } from '../../constants/routes'

export const productRoutes = [
  {
    index: true,
    lazy: () => import('./listing'),
  },
  {
    path: ROUTE_PATHS.productDetail,
    lazy: () => import('./detail'),
  },
]
