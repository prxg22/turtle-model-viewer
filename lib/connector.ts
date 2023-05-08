import type { Product } from './types'

export const baseUrl = new URL(import.meta.env.VITE_TURTLE_APP_URL)

export const authenticateCustomer = async (apiToken: string) => {
  const url = baseUrl
  url.pathname = '/api/customers/auth'
  url.searchParams.set('t', apiToken)

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }
  const response = await fetch(url, config)

  if (!response.ok || response.status !== 200) {
    throw new Error('Failed to authorize customer')
  }

  return
}
export const fetchProduct = async (options: { productSlug?: string }) => {
  if (!options.productSlug) throw new Error('Missing customer or product')

  const url = baseUrl
  url.pathname = `/api/products/${options.productSlug}`
  const config: RequestInit = {
    credentials: 'include',
  }

  const response = await fetch(url, config)

  if (!response.ok || response.status !== 200) {
    if (response.status === 404) {
      throw new Error('Product not found')
    }
    throw new Error('Failed to fetch products')
  }

  return response.json() as Promise<Product>
}
