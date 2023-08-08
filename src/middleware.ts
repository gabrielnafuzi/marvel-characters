import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: new Headers({
        'x-search-params': encodeURIComponent(
          request.nextUrl.searchParams.toString(),
        ),
      }),
    },
  })
}

export const config = {
  matcher: ['/'],
}
