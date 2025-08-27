// src/hooks/useTransitSearch.ts

import { useState } from 'react'
import type {
  OdsayPath,
  PathResult,
  Point,
  ClickStep,
  ProcessedResult,
} from '@/types'
import { fetchOdsayPath } from '@/lib/odsayApi'
import { searchNearbyPlace } from '@/lib/kakaoApi'
import { getDistance } from '@/lib/utils'

const MIN_DISTANCE_METERS = 1000 // 최소 1km
const MAX_DISTANCE_METERS = 2000 // 최대 2km
const MAX_WAYPOINT_SEARCH_ATTEMPTS = 10

export const useTransitSearch = () => {
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [waypoint, setWaypoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)
  const [clickStep, setClickStep] = useState<ClickStep>('start')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [processedResults, setProcessedResults] =
    useState<ProcessedResult | null>(null)
  const [selectedPathIndex1, setSelectedPathIndex1] = useState<number>(0)
  const [selectedPathIndex2, setSelectedPathIndex2] = useState<number>(0)

  const handleMapClick = (
    _: kakao.maps.Map,
    mouseEvent: kakao.maps.event.MouseEvent
  ) => {
    if (clickStep === 'done') return

    const newPoint: Point = {
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng(),
    }

    if (clickStep === 'start') {
      setStartPoint(newPoint)
      setWaypoint(null)
      setEndPoint(null)
      setProcessedResults(null)
      setClickStep('end')
    } else if (clickStep === 'end') {
      setEndPoint(newPoint)
      setClickStep('done')
    }
  }

  const analyzeResults = (result1: PathResult, result2: PathResult) => {
    const paths1 = result1.result?.path
    const paths2 = result2.result?.path

    if (!paths1?.length || !paths2?.length) {
      alert('경로를 찾을 수 없습니다.')
      return
    }

    setProcessedResults({
      section1Paths: paths1,
      section2Paths: paths2,
    })
    setSelectedPathIndex1(0)
    setSelectedPathIndex2(0)
  }

  const handleSearchAndAnalyze = async (): Promise<void> => {
    if (!startPoint || !endPoint) {
      alert('출발지와 도착지를 모두 설정해주세요.')
      return
    }

    setIsLoading(true)
    setProcessedResults(null)
    setWaypoint(null)

    try {
      let foundWaypoint: Point | null = null

      for (let i = 0; i < MAX_WAYPOINT_SEARCH_ATTEMPTS; i++) {
        const candidate = await searchNearbyPlace(startPoint)
        if (candidate) {
          const distFromStart = getDistance(startPoint, candidate)

          if (
            distFromStart >= MIN_DISTANCE_METERS &&
            distFromStart <= MAX_DISTANCE_METERS
          ) {
            foundWaypoint = candidate
            break
          }
        }
      }

      if (!foundWaypoint) {
        alert(
          '출발지 1~2km 반경 내에 적절한 대중교통 경유지를 찾지 못했습니다. 다른 출발지를 선택해주세요.'
        )
        setIsLoading(false)
        return
      }

      setWaypoint(foundWaypoint)

      // ✨ 요청하신 API 파라미터 수정사항을 여기에 적용했습니다.
      const [result1, result2] = await Promise.all([
        fetchOdsayPath({
          SX: startPoint.lng.toString(),
          SY: startPoint.lat.toString(),
          EX: foundWaypoint.lng.toString(),
          EY: foundWaypoint.lat.toString(),
          SearchPathType: '2', // 버스 경로
        }),
        fetchOdsayPath({
          SX: foundWaypoint.lng.toString(),
          SY: foundWaypoint.lat.toString(),
          EX: endPoint.lng.toString(),
          EY: endPoint.lat.toString(),
          SearchPathType: '2', // 버스 경로
        }),
      ])

      analyzeResults(result1, result2)
    } catch (error) {
      alert('길찾기 정보를 가져오는 데 실패했습니다.')
      console.error(error)
    } finally {
      setIsLoading(false)
      setClickStep('done')
    }
  }

  const handleReset = (): void => {
    setStartPoint(null)
    setWaypoint(null)
    setEndPoint(null)
    setProcessedResults(null)
    setClickStep('start')
    setSelectedPathIndex1(0)
    setSelectedPathIndex2(0)
  }

  return {
    points: { startPoint, waypoint, endPoint },
    uiState: { clickStep, isLoading },
    results: {
      processedResults,
      selectedPathIndex1,
      selectedPathIndex2,
    },
    actions: {
      handleMapClick,
      handleSearchAndAnalyze,
      handleReset,
      setSelectedPathIndex1,
      setSelectedPathIndex2,
    },
  }
}
