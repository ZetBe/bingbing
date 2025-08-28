// src/lib/kakaoApi.ts

import type { Point, Place } from '@/types'

/**
 * 주어진 좌표 근처의 장소를 검색하여 랜덤으로 하나를 반환합니다.
 * @param center 검색 중심 좌표
 * @returns 검색된 장소의 좌표 또는 null
 */
export const searchNearbyPlace = async (
  center: Point,
  radius: number = 2500
): Promise<Point | null> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('Kakao Maps script not loaded.')
      return reject(new Error('Kakao Maps script not loaded.'))
    }

    const placesService = new window.kakao.maps.services.Places()
    const searchKeywords = ['카페', '맛집', '미술관', '지하철역']
    const randomKeyword =
      searchKeywords[Math.floor(Math.random() * searchKeywords.length)]

    const callback = (result: Place[], status: kakao.maps.services.Status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        const randomPlace = result[Math.floor(Math.random() * result.length)]
        resolve({
          lat: parseFloat(randomPlace.y),
          lng: parseFloat(randomPlace.x),
        })
      } else {
        // 검색 결과가 없으면 null 반환
        resolve(null)
      }
    }

    placesService.keywordSearch(randomKeyword, callback, {
      location: new kakao.maps.LatLng(center.lat, center.lng),
      radius: radius,
    })
  })
}
