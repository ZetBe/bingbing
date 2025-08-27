// src/components/KakaoMap.tsx

import { Map, CustomOverlayMap } from 'react-kakao-maps-sdk'
import type { Point } from '@/types'
import React from 'react'

interface KakaoMapProps {
  points: {
    startPoint: Point | null
    waypoint: Point | null
    endPoint: Point | null
  }
  onMapClick: (
    map: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) => void
}

const PointMarker: React.FC<{
  position: Point
  label: string
  color?: string
}> = ({ position, label, color }) => {
  const labelStyle: React.CSSProperties = {
    color: color ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  }

  return (
    <CustomOverlayMap position={position} yAnchor={1.4}>
      <div style={labelStyle}>{label}</div>
    </CustomOverlayMap>
  )
}

const KakaoMap: React.FC<KakaoMapProps> = ({ points, onMapClick }) => {
  const { startPoint, waypoint, endPoint } = points

  return (
    <div className="h-full w-full flex-1">
      <Map
        center={{ lat: 37.566826, lng: 126.9786567 }} // 서울 중심
        style={{ width: '100%', height: '100%' }}
        level={6}
        onClick={onMapClick}
      >
        {startPoint && <PointMarker position={startPoint} label="출발" />}
        {waypoint && (
          <PointMarker
            position={waypoint}
            label="경유(자동)"
            color="hsl(var(--primary))"
          />
        )}
        {endPoint && <PointMarker position={endPoint} label="도착" />}
      </Map>
    </div>
  )
}

export default KakaoMap
