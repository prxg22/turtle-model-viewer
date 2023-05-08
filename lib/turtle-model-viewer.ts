import { fetchProduct, authenticateCustomer, baseUrl } from './connector'
import type { Product } from './types'

export const setup = (w: Window, apiToken: string) => {
  class TurtleModelViewer extends HTMLElement {
    shadow: ShadowRoot
    googleModelViewer: HTMLElement | null = null
    product?: Product
    customerId: string = ''

    constructor() {
      super()
      const productSlug = this.getAttribute('product') || ''
      this.shadow = this.attachShadow({ mode: 'open' })

      this.build({ productSlug, shadow: this.shadow })
    }

    async getProduct(options: { productSlug: string }) {
      const product = await fetchProduct(options)
      return product
    }

    async attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string,
    ) {
      if (name !== 'product' || oldValue === newValue) return

      if (this.googleModelViewer) {
        this.removeGoogleModelViewer({
          shadow: this.shadow,
          googleModelViewer: this.googleModelViewer,
        })
        this.googleModelViewer = null
      }

      this.build({ productSlug: newValue, shadow: this.shadow })
    }

    private async build(options: { productSlug: string; shadow: ShadowRoot }) {
      const product = await this.getProduct({
        productSlug: options.productSlug,
      })

      this.googleModelViewer = this.buildGoogleModelViewer({
        shadow: options.shadow,
        product,
      })

      this.product = product
    }

    buildGoogleModelViewer(options: { shadow: ShadowRoot; product: Product }) {
      if (!options.shadow) throw new Error('No shadow')
      if (!options.product) return null
      const googleModelViewer = document.createElement('model-viewer')
      this.addProductTagAttributes({
        googleModelViewer,
        tagAttributes: options.product.tagAttributes,
      })
      options.shadow.appendChild(googleModelViewer)
      return googleModelViewer
    }

    removeGoogleModelViewer(options: {
      shadow: ShadowRoot
      googleModelViewer: HTMLElement | null
    }) {
      if (!options.shadow) throw new Error('No shadow')
      if (!this.googleModelViewer) return
      options.shadow.removeChild(this.googleModelViewer)
    }

    addProductTagAttributes(options: {
      googleModelViewer: HTMLElement
      tagAttributes: Product['tagAttributes']
    }) {
      if (!options.googleModelViewer) throw new Error('No googleModelViewer')
      if (!options.tagAttributes) throw new Error('No tagAttributes')

      Object.values(options.tagAttributes).forEach((tagAttribute) => {
        let key: string
        let value: string
        if (!tagAttribute.key) {
          console.warn('No tagAttribute key')
          return
        }

        key = tagAttribute.key
        switch (tagAttribute.type) {
          case 'text':
            if (!tagAttribute.value) {
              console.warn('No tagAttribute value')
              return
            }
            value = tagAttribute.value
            break
          case 'file': {
            if (!tagAttribute.uploaded || !tagAttribute.value) {
              console.warn('No tagAttribute uploaded')
              return
            }
            const url = baseUrl
            url.pathname = tagAttribute.value
            value = url.toString()
            break
          }
          default:
            value = 'true'
        }

        options.googleModelViewer.setAttribute(key, value)
      })
    }

    static setup(w: Window, apiToken: string) {
      return Promise.all([
        import('@google/model-viewer').then(() =>
          w.customElements.define('turtle-model-viewer', TurtleModelViewer),
        ),
        authenticateCustomer(apiToken).then(() => {}),
      ])
    }
  }

  return Promise.all([
    import('@google/model-viewer'),
    authenticateCustomer(apiToken),
  ]).then(() =>
    w.customElements.define('turtle-model-viewer', TurtleModelViewer),
  )
}
