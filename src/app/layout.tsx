import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { ApiKeys, ApiKeysProvider } from '@/context/apiKeysContext'
import './globals.css'

const GA_MEASUREMENT_ID = process.env.GA_ID

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'bingbing',
  description: '일부러 돌아가요',
  verification: {
    google: 'zBs1Ng1bhNf_OicTIkiWacrEk6V_WlU_8WV7svSVWtE',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const keys: ApiKeys = {
    kakaoMapApiKey: process.env.KAKAOMAP_API_KEY || '',
    odsayApiKey: process.env.ODSAY_API_KEY || '',
  }
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="bingbing" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ApiKeysProvider keys={keys}>{children}</ApiKeysProvider>
      </body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </html>
  )
}
