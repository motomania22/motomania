export interface Product {
  id: string
  title: string
  price: number
  currency: string
  thumbnail: string
  permalink: string
  category_id: string
  category_name: string
  condition: 'new' | 'used' | 'not_specified'
  available_quantity: number
  source: 'mercadolibre' | 'enviocompras'
  updated_at: string
}