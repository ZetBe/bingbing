// src/components/KakaoMap.tsx

import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk'
import type { Point } from '@/types'
import React from 'react'

// ✨ 새로운 카드 스타일의 라벨 컴포넌트
const PointMarkerLabel: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="flex flex-col items-center">
      {/* 카드 본문 */}
      <div className="rounded-md border border-foreground/50 bg-background px-3 py-1.5 text-sm font-semibold text-foreground shadow-lg">
        {label}
      </div>
      {/* 카드 꼬리 (CSS로 삼각형 모양 생성) */}
      <div className="-mt-1.5 h-3 w-3 rotate-45 border-b border-r border-foreground/50 bg-background" />
    </div>
  )
}

// ✨ PointMarker가 새로운 라벨 컴포넌트를 사용하도록 수정
const PointMarker: React.FC<{
  position: Point
  label: string
  type: 'start' | 'waypoint' | 'end'
}> = ({ position, label, type }) => {
  return (
    <>
      {/* 마커 위에 표시될 커스텀 라벨 */}
      <CustomOverlayMap position={position} yAnchor={2.2}>
        <PointMarkerLabel label={label} />
      </CustomOverlayMap>
    </>
  )
}

const KakaoMap: React.FC<{
  points: {
    startPoint: Point | null
    waypoint: Point | null
    endPoint: Point | null
  }
  onMapClick: (
    map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) => void
}> = ({ points, onMapClick }) => {
  const { startPoint, waypoint, endPoint } = points

  return (
    <div className="h-full flex-1">
      <Map
        center={{ lat: 37.566826, lng: 126.9786567 }}
        style={{ width: '100%', height: '100%' }}
        level={6}
        onClick={onMapClick}
      >
        {startPoint && (
          <PointMarker position={startPoint} label="출발" type="start" />
        )}
        {waypoint && (
          <PointMarker position={waypoint} label="경유" type="waypoint" />
        )}
        {endPoint && (
          <PointMarker position={endPoint} label="도착" type="end" />
        )}
      </Map>
    </div>
  )
}

export default KakaoMap
