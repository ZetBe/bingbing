// src/components/PathDetail.tsx

import { OdsayPath, SubPath } from '@/types'
import React from 'react'

const SubPathItem: React.FC<{ subPath: SubPath }> = ({ subPath }) => {
  const {
    trafficType,
    sectionTime,
    distance,
    lane,
    stationCount,
    startName,
    endName,
  } = subPath

  const icon = { 1: '🚇', 2: '🚌', 3: '🚶‍♂️' }[trafficType]

  const description = () => {
    switch (trafficType) {
      case 1: // 지하철
        return (
          <>
            <p className="font-bold">{lane?.[0]?.name} 탑승</p>
            <p className="text-xs text-muted-foreground">
              {stationCount}개 역 이동 ({sectionTime}분)
            </p>
            <p className="text-xs text-muted-foreground">
              {startName} → {endName}
            </p>
          </>
        )
      case 2: // 버스
        return (
          <>
            <p className="font-bold">{lane?.[0]?.busNo}번 버스 탑승</p>
            <p className="text-xs text-muted-foreground">
              {stationCount}개 정류장 이동 ({sectionTime}분)
            </p>
            <p className="text-xs text-muted-foreground">
              {startName} → {endName}
            </p>
          </>
        )
      case 3: // 도보
        return (
          <p>
            도보 {sectionTime}분 ({distance}m 이동)
          </p>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span>{icon}</span>
      <div>{description()}</div>
    </div>
  )
}

const PathDetail: React.FC<{ path: OdsayPath }> = ({ path }) => {
  return (
    <div className="mt-4 space-y-2">
      {path.subPath.map((sub, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className="ml-3 h-4 border-l-2 border-dotted border-border"></div>
          )}
          <SubPathItem subPath={sub} />
        </React.Fragment>
      ))}
    </div>
  )
}

export default PathDetail
