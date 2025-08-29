// src/lib/odsayApi.ts

import { useApiKeys } from '@/context/apiKeysContext'
import type { PathResult } from '@/types'

interface FetchPathParams {
  SX: string // 출발지 X좌표(경도)
  SY: string // 출발지 Y좌표(위도)
  EX: string // 도착지 X좌표(경도)
  EY: string // 도착지 Y좌표(위도)
  SearchPathType: string
  apiKey: string
}

/**
 * ODsay 대중교통 길찾기 API를 호출합니다.
 * @param params 출발지 및 도착지 좌표
 * @returns 경로 탐색 결과 Promise
 */
export const fetchOdsayPath = async (
  params: FetchPathParams
): Promise<PathResult> => {
  const queryString = new URLSearchParams({
    ...params,
  }).toString()

  const url = `https://api.odsay.com/v1/api/searchPubTransPathT?${queryString}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data from ODsay API.')
  }
  return response.json()
}
