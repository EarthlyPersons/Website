type AssetsBinding = {
  fetch: (request: Request) => Promise<Response>
}

type Env = {
  ASSETS: AssetsBinding
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()')
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https://*.workers.dev https://firestore.googleapis.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
  )
  headers.delete('Server')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function shouldServeSpaFallback(request: Request, response: Response): boolean {
  if (request.method !== 'GET') return false
  if (response.status !== 404) return false

  const url = new URL(request.url)
  if (url.pathname.startsWith('/api/')) return false
  if (url.pathname.includes('.')) return false

  const accept = request.headers.get('accept') ?? ''
  return accept.includes('text/html')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const assetResponse = await env.ASSETS.fetch(request)

    if (shouldServeSpaFallback(request, assetResponse)) {
      const fallbackRequest = new Request(new URL('/index.html', request.url), request)
      const fallbackResponse = await env.ASSETS.fetch(fallbackRequest)
      return withSecurityHeaders(fallbackResponse)
    }

    return withSecurityHeaders(assetResponse)
  },
}
