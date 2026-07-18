import { ApiClient } from './apiClient'

const ProductService = {}

ProductService.list = (params) => ApiClient.get('/products', { params })

ProductService.getById = (id) => ApiClient.get(`/products/${id}`)

export default ProductService
