// src/contexts/apiKeysContext.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'

// Context에 저장될 키들의 타입을 정의합니다.
export interface ApiKeys {
  kakaoMapApiKey: string
  odsayApiKey: string
}

// Context를 생성합니다. 초기값은 null로 설정하여, Provider가 없을 경우 에러를 발생시키도록 합니다.
const ApiKeysContext = createContext<ApiKeys | null>(null)

// Context Provider 컴포넌트입니다.
// 이 컴포넌트가 layout.tsx에서 서버로부터 받은 키를 자식 컴포넌트들에게 전달합니다.
export function ApiKeysProvider({
  children,
  keys,
}: {
  children: ReactNode
  keys: ApiKeys
}) {
  return (
    <ApiKeysContext.Provider value={keys}>{children}</ApiKeysContext.Provider>
  )
}

// 다른 컴포넌트에서 쉽게 키를 꺼내 쓸 수 있도록 도와주는 커스텀 훅입니다.
export function useApiKeys() {
  const context = useContext(ApiKeysContext)
  if (!context) {
    throw new Error('useApiKeys must be used within an ApiKeysProvider')
  }
  return context
}
