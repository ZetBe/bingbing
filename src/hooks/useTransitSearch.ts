// src/hooks/useTransitSearch.ts

import { useState } from 'react'
import type { PathResult, Point, ClickStep, ProcessedResult } from '@/types'
import { fetchOdsayPath } from '@/lib/odsayApi'
import { searchNearbyPlace } from '@/lib/kakaoApi'
import { getDetourSearchCenter, getDistance } from '@/lib/utils'

const MAX_WAYPOINT_SEARCH_ATTEMPTS = 10
export const SEARCH_LIMIT = 5 // ✨ 출발-도착지 당 최대 탐색 횟수

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
  // ✨ 현재 경로에 대한 탐색 횟수를 저장하는 상태
  const [searchCount, setSearchCount] = useState(0)

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
      setSearchCount(0) // ✨ 새로운 출발지를 찍으면 탐색 횟수 초기화
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
    // ✨ 탐색 시작 전, 횟수 제한을 확인
    if (searchCount >= SEARCH_LIMIT) {
      alert(
        `경유지 탐색은 출발-도착지마다 ${SEARCH_LIMIT}번까지만 가능합니다.\n다른 지점을 선택하시거나 초기화 후 다시 시도해주세요.`
      )
      return
    }

    if (!startPoint || !endPoint) {
      alert('출발지와 도착지를 모두 설정해주세요.')
      return
    }

    // ✨ 탐색 횟수를 1 증가시킴
    setSearchCount((prevCount) => prevCount + 1)

    setIsLoading(true)
    setProcessedResults(null)
    setWaypoint(null)

    try {
      const searchCenter = getDetourSearchCenter(startPoint, endPoint)
      const totalDistance = getDistance(startPoint, endPoint)
      const searchRadius = Math.max(1500, Math.floor(totalDistance / 4))

      let foundWaypoint: Point | null = null

      for (let i = 0; i < MAX_WAYPOINT_SEARCH_ATTEMPTS; i++) {
        const candidate = await searchNearbyPlace(searchCenter, searchRadius)
        if (candidate) {
          foundWaypoint = candidate
          break
        }
      }

      if (!foundWaypoint) {
        alert('경로 주변에서 적절한 대중교통 경유지를 찾지 못했습니다.')
        setIsLoading(false)
        return
      }

      setWaypoint(foundWaypoint)

      const [result1, result2] = await Promise.all([
        fetchOdsayPath({
          SX: startPoint.lng.toString(),
          SY: startPoint.lat.toString(),
          EX: foundWaypoint.lng.toString(),
          EY: foundWaypoint.lat.toString(),
          SearchPathType: '2',
        }),
        fetchOdsayPath({
          SX: foundWaypoint.lng.toString(),
          SY: foundWaypoint.lat.toString(),
          EX: endPoint.lng.toString(),
          EY: endPoint.lat.toString(),
          SearchPathType: '2',
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
    setSearchCount(0) // ✨ 초기화 시 탐색 횟수 초기화
  }

  return {
    points: { startPoint, waypoint, endPoint },
    uiState: {
      clickStep,
      isLoading,
      searchCount,
    },
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
