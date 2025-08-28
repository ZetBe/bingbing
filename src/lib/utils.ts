// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Point } from '@/types'

// 이 파일은 shadcn/ui 설치 시 자동으로 생성되는 파일입니다.
// 기존에 있던 cn 함수는 그대로 두시면 됩니다.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** * 두 지점 간의 직선 거리를 미터(m) 단위로 계산합니다. (Haversine 공식)
 * @param p1 첫 번째 지점의 좌표 { lat, lng }
 * @param p2 두 번째 지점의 좌표 { lat, lng }
 * @returns 두 지점 사이의 거리 (미터)
 */
export function getDistance(p1: Point, p2: Point): number {
  const R = 6371e3 // 지구 반지름 (미터)
  const φ1 = (p1.lat * Math.PI) / 180
  const φ2 = (p2.lat * Math.PI) / 180
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // 거리 (미터)
}

export function getDetourSearchCenter(p1: Point, p2: Point): Point {
  // 1. 중간 지점 계산
  const midLat = (p1.lat + p2.lat) / 2
  const midLng = (p1.lng + p2.lng) / 2

  // 2. 출발지-도착지 벡터 계산
  const vecLat = p2.lat - p1.lat
  const vecLng = p2.lng - p1.lng

  // 3. 수직 벡터 계산 (90도 회전)
  const perpVecLat = -vecLng
  const perpVecLng = vecLat

  // 4. 벡터 정규화 (방향만 남김)
  const magnitude = Math.sqrt(perpVecLat ** 2 + perpVecLng ** 2)
  if (magnitude === 0) return { lat: midLat, lng: midLng } // 출발지와 도착지가 같으면 중간점 반환
  const normPerpLat = perpVecLat / magnitude
  const normPerpLng = perpVecLng / magnitude

  // 5. 전체 거리의 약 1/3 만큼을 이동 거리로 설정
  // 위도 1도의 거리는 대략 111km 이므로, 이를 이용해 미터 단위를 위경도 값으로 변환
  const totalDistance = getDistance(p1, p2)
  const offsetScale = totalDistance / 3 / 111000

  // 6. 왼쪽 또는 오른쪽 방향 랜덤 선택
  const direction = Math.random() < 0.5 ? 1 : -1

  // 7. 새로운 탐색 중심점 좌표 반환
  const searchCenterLat = midLat + normPerpLat * offsetScale * direction
  const searchCenterLng = midLng + normPerpLng * offsetScale * direction

  return { lat: searchCenterLat, lng: searchCenterLng }
}
