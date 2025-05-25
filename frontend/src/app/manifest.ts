import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '따온',
    short_name: '따온',
    description: '따뜻한 마음을 나눠요',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#ff6b6b',
    lang: 'ko',
    dir: 'ltr',
    scope: '/',
    categories: ['lifestyle', 'social'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      }
    ],
  }
}