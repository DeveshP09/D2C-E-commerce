
import { ROUTE_PATHS } from '../../constants/routes'

export const categoryRoutes = [
  {
    path: ROUTE_PATHS.categories,
    lazy: () => import('./category-list'),
  },
]
