// src/components/ControlPanel.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTransitSearch, SEARCH_LIMIT } from '@/hooks/useTransitSearch'
import { useApiKeys } from '@/context/apiKeysContext'
import { Loader2 } from 'lucide-react'

type ControlPanelProps = Pick<
  ReturnType<typeof useTransitSearch>,
  'points' | 'uiState' | 'actions'
>

const ControlPanel: React.FC<ControlPanelProps> = ({
  points,
  uiState,
  actions,
}) => {
  const { startPoint, endPoint } = points
  const { clickStep, isLoading, searchCount } = uiState
  const { handleSearchAndAnalyze, handleReset } = actions
  const apiKey = useApiKeys()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">지도 클릭 순서</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <span
              className={clickStep === 'start' ? 'font-bold text-primary' : ''}
            >
              ① 출발지
            </span>
            {' → '}
            <span
              className={clickStep === 'end' ? 'font-bold text-primary' : ''}
            >
              ② 도착지
            </span>
            {' → '}
            <span
              className={clickStep === 'start' ? 'font-bold text-primary' : ''}
            >
              경유지 랜덤 배정
            </span>
          </p>
          <div className="mt-4 space-y-1 text-sm">
            <p>
              <strong>출발지:</strong> {startPoint ? '설정됨' : '미설정'}
            </p>
            <p>
              <strong>도착지:</strong> {endPoint ? '설정됨' : '미설정'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button
          onClick={() => handleSearchAndAnalyze(apiKey.odsayApiKey)}
          disabled={isLoading || !startPoint || !endPoint}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? '탐색 중...' : '경유 경로 분석'}
        </Button>
        {startPoint && endPoint && (
          <p className="text-center text-xs text-muted-foreground">
            남은 탐색 횟수: {SEARCH_LIMIT - searchCount} / {SEARCH_LIMIT}
          </p>
        )}
        <Button onClick={handleReset} variant="outline" className="w-full">
          초기화
        </Button>
      </div>
    </div>
  )
}

export default ControlPanel
