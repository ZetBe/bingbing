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
