// src/components/useKakaoMapLoader.ts

import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk'

export default function useKakaoMapLoader() {
  useKakaoLoaderOrigin({
    appkey: process.env.NEXT_PUBLIC_KAKAOMAP_API_KEY as string, // .env.local 파일에 키를 저장하세요
    libraries: ['services', 'clusterer', 'drawing'],
  })
}
