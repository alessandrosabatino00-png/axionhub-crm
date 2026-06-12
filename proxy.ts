import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl

  // Se non autenticato e non è la pagina login → redirect a /login
  if (!user && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se autenticato e va su /login → redirect in base al ruolo
  if (user && pathname === '/login') {
    const { data } = await supabase
      .from('agency_users')
      .select('role, agency_id')
      .eq('user_id', user.id)
      .single()

    if (data?.role === 'founder') {
      return NextResponse.redirect(new URL('/founder', req.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Protegge /founder da utenti non founder
  if (pathname.startsWith('/founder')) {
    const { data } = await supabase
      .from('agency_users')
      .select('role')
      .eq('user_id', user!.id)
      .single()

    if (data?.role !== 'founder') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Verifica abbonamento per utenti agenzia
  if (pathname === '/dashboard' && user) {
    const { data } = await supabase
      .from('agency_users')
      .select('role, agency_id')
      .eq('user_id', user.id)
      .single()

    if (data?.role === 'agent' && data?.agency_id) {
      const { data: agency } = await supabase
        .from('agencies')
        .select('subscription_active')
        .eq('id', data.agency_id)
        .single()

      if (!agency?.subscription_active) {
        return NextResponse.redirect(new URL('/subscription-required', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
