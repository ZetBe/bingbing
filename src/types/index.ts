// src/types/index.ts

/** 지도 위의 좌표점 (위도, 경도) */
export interface Point {
  lat: number
  lng: number
}

/** 카카오 장소 검색 API의 응답 데이터 형식 */
export interface Place {
  id: string
  place_name: string
  x: string // 경도 (lng)
  y: string // 위도 (lat)
}

/** 지도 클릭의 현재 단계를 나타내는 타입 */
export type ClickStep = 'start' | 'end' | 'done'

// --- ODsay 대중교통 API 관련 타입 ---

/** 경로 내 세부 이동 구간 (버스, 지하철, 도보 등) */
export interface SubPath {
  trafficType: number // 1:지하철, 2:버스, 3:도보
  distance: number
  sectionTime: number
  stationCount?: number
  startName?: string
  endName?: string
  lane?: {
    busNo?: string // 버스 번호
    name?: string // 지하철 노선 이름
  }[]
}

/** ODsay API가 반환하는 하나의 전체 경로 추천안 */
export interface OdsayPath {
  pathType: number // 1:지하철, 2:버스, 3:버스+지하철
  info: {
    totalTime: number
    payment: number
    totalWalk: number
  }
  subPath: SubPath[]
}

/** ODsay API 응답의 최상위 구조 */
export interface PathResult {
  result?: {
    path: OdsayPath[]
  }
}

// --- 애플리케이션 내부에서 사용하는 가공된 데이터 타입 ---

/**
 * 두 구간의 경로 탐색 결과를 분석하여 UI에 표시하기 위해 가공한 데이터 구조
 */
export interface ProcessedResult {
  section1Paths: OdsayPath[] // 출발지 -> 경유지 경로 목록
  section2Paths: OdsayPath[] // 경유지 -> 도착지 경로 목록
}
