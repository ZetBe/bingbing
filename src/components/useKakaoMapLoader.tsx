// src/components/useKakaoMapLoader.ts

import { useApiKeys } from '@/context/apiKeysContext'
import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk'

export default function useKakaoMapLoader() {
  const APPKEY = useApiKeys()
  useKakaoLoaderOrigin({
    appkey: APPKEY.kakaoMapApiKey, // .env.local 파일에 키를 저장하세요
    libraries: ['services', 'clusterer', 'drawing'],
  })
}
