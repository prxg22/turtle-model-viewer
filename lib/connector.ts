import type { Product } from '../../turtle-app/server/types'

export const baseUrl = new URL('https://d1ax4zfrjmdkij.cloudfront.net/')
// export const baseUrl = new URL('http://127.0.0.1:3000/')

export const authenticateCustomer = async (apiToken: string) => {
  const url = new URL(baseUrl)
  url.pathname = '/api/customers/auth'
  url.searchParams.set('t', apiToken)

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    // mode: 'no-cors',
  }
  const response = await fetch(url, config)

  if (!response.ok || response.status !== 200) {
    throw new Error('Failed to authorize customer')
  }

  return
}
export const fetchProduct = async (options: { productSlug?: string }) => {
  if (!options.productSlug) throw new Error('Missing customer or product')

  const url = new URL(baseUrl)
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
