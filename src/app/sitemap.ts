// src/app/sitemap.ts

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // ✨ 웹사이트의 기본 URL을 여기에 입력하세요.
  const baseUrl = 'https://bingbing-rose.vercel.app/'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // 만약 다른 페이지(예: /about, /contact)가 있다면 아래와 같이 추가할 수 있습니다.
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ]
}
