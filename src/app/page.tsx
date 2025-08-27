// src/app/page.tsx
'use client'
import useKakaoMapLoader from '@/components/useKakaoMapLoader'
import KakaoMap from '@/components/KakaoMap'
import Sidebar from '@/components/Sidebar'
import { useTransitSearch } from '@/hooks/useTransitSearch'

export default function Home() {
  useKakaoMapLoader()

  // 🧠 로직은 훅 한 줄로 끝!
  const { points, uiState, results, actions } = useTransitSearch()

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* 📄 UI는 컴포넌트에 데이터를 내려주기만 하면 끝! */}
      <Sidebar
        points={points}
        uiState={uiState}
        results={results}
        actions={actions}
      />
      <KakaoMap points={points} onMapClick={actions.handleMapClick} />
    </div>
  )
}
