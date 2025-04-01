// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)','/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, redirectToSignIn } = await auth()
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  if (userId && !isPublicRoute) {
    let path = "/select-org";

    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  // if the user is not logged in
  if (!userId && !isPublicRoute(req)) {
    // Add custom logic to run before redirecting
    return redirectToSignIn({returnBackUrl: req.url})
  }

  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelection);
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}






// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// import { NextResponse } from 'next/server';

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, orgId, redirectToSignIn } = await auth()

//   if (userId && !isProtectedRoute) {
//     let path = "/select-org";

//     if (orgId) {
//       path = `/organization/${orgId}`;
//     }

//     const orgSelection = new URL(path, req.url);
//     return NextResponse.redirect(orgSelection);
//   }

//   // if the user is not logged in
//   if (!userId && isProtectedRoute(req)) {
//     // Add custom logic to run before redirecting
//     return redirectToSignIn({returnBackUrl: req.url})
//   }

//   if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
//     const orgSelection = new URL("/select-org", req.url);
//     return NextResponse.redirect(orgSelection);
//   }
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }






// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// import { NextResponse } from 'next/server'

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, orgId, redirectToSignIn } = await auth()
//   const currentPath = req.nextUrl.pathname

//   // If user is NOT authenticated and is on a protected route, redirect to sign-in
//   if (!userId && isProtectedRoute(req)) {
//     //const signInUrl = redirectToSignIn({ returnBackUrl: req.url }) // Get sign-in URL
//     return redirectToSignIn({ returnBackUrl: req.url }) // Redirect to Clerk sign-in
//   }

//   // If user is authenticated but has no organization, redirect to org selection
//   if (userId && !orgId && currentPath !== "/select-org") {
//     return NextResponse.redirect(new URL("/select-org", req.url))
//   }

//   // If user is authenticated and belongs to an org, redirect to their organization page
//   if (userId && orgId && isProtectedRoute(req)) {
//     return NextResponse.redirect(new URL(`/organization/${orgId}`, req.url))
//   }

//   // Allow access to all other routes
//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// }
