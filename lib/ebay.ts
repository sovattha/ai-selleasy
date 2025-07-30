interface EbayTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface EbayListingData {
  title: string
  description: string
  price: number
  imageUrls: string[]
}

interface EbayListingResponse {
  listingId: string
  listingUrl: string
}

export class EbayAPI {
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken
    }

    const credentials = Buffer.from(
      `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
    })

    if (!response.ok) {
      throw new Error('Failed to get eBay access token')
    }

    const data: EbayTokenResponse = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000 // 1 minute buffer

    return this.accessToken
  }

  async createListing(data: EbayListingData): Promise<EbayListingResponse> {
    const accessToken = await this.getAccessToken()
    
    const listingData = {
      Item: {
        Title: data.title,
        Description: data.description,
        StartPrice: {
          currencyID: 'USD',
          value: data.price.toString(),
        },
        CategoryID: '1',
        Country: 'US',
        Currency: 'USD',
        DispatchTimeMax: 3,
        ListingDuration: 'Days_7',
        ListingType: 'FixedPriceItem',
        PaymentMethods: ['PayPal'],
        PictureDetails: {
          PictureURL: data.imageUrls,
        },
        PostalCode: '95125',
        Quantity: 1,
        ReturnPolicy: {
          ReturnsAcceptedOption: 'ReturnsAccepted',
          RefundOption: 'MoneyBack',
          ReturnsWithinOption: 'Days_30',
          ShippingCostPaidByOption: 'Buyer',
        },
        ShippingDetails: {
          ShippingType: 'Flat',
          ShippingServiceOptions: [{
            ShippingServicePriority: 1,
            ShippingService: 'USPSMedia',
            ShippingServiceCost: {
              currencyID: 'USD',
              value: '2.50',
            },
          }],
        },
        Site: 'US',
      },
    }

    const baseUrl = process.env.EBAY_SANDBOX === 'true' 
      ? 'https://api.sandbox.ebay.com'
      : 'https://api.ebay.com'

    const response = await fetch(`${baseUrl}/ws/api.dll`, {
      method: 'POST',
      headers: {
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-DEV-NAME': process.env.EBAY_CLIENT_ID!,
        'X-EBAY-API-APP-NAME': process.env.EBAY_CLIENT_ID!,
        'X-EBAY-API-CERT-NAME': process.env.EBAY_CLIENT_SECRET!,
        'X-EBAY-API-CALL-NAME': 'AddFixedPriceItem',
        'X-EBAY-API-SITEID': '0',
        'Content-Type': 'text/xml',
      },
      body: this.buildXMLRequest(listingData),
    })

    if (!response.ok) {
      throw new Error('Failed to create eBay listing')
    }

    const xmlResponse = await response.text()
    
    return {
      listingId: this.extractFromXML(xmlResponse, 'ItemID'),
      listingUrl: `https://www.ebay.com/itm/${this.extractFromXML(xmlResponse, 'ItemID')}`,
    }
  }

  private buildXMLRequest(data: any): string {
    return `<?xml version="1.0" encoding="utf-8"?>
      <AddFixedPriceItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
        <RequesterCredentials>
          <eBayAuthToken>${process.env.EBAY_REFRESH_TOKEN}</eBayAuthToken>
        </RequesterCredentials>
        ${this.objectToXML(data)}
      </AddFixedPriceItemRequest>`
  }

  private objectToXML(obj: any): string {
    if (typeof obj !== 'object') return obj
    
    let xml = ''
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any) => {
          xml += `<${key}>${this.objectToXML(item)}</${key}>`
        })
      } else if (typeof obj[key] === 'object') {
        xml += `<${key}>${this.objectToXML(obj[key])}</${key}>`
      } else {
        xml += `<${key}>${obj[key]}</${key}>`
      }
    }
    return xml
  }

  private extractFromXML(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}>(.*?)</${tag}>`)
    const match = xml.match(regex)
    return match ? match[1] : ''
  }
}

export const ebayAPI = new EbayAPI()