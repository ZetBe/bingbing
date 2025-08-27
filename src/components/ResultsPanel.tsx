// src/components/ResultsPanel.tsx

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTransitSearch } from '@/hooks/useTransitSearch'
import PathDetail from './PathDetail'
import { OdsayPath } from '@/types'

type ResultsPanelProps = Pick<
  ReturnType<typeof useTransitSearch>,
  'results' | 'actions'
>

const PathCard: React.FC<{
  title: string
  paths: OdsayPath[]
  selectedIndex: number
  onSelectPath: (index: number) => void
}> = ({ title, paths, selectedIndex, onSelectPath }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-4 flex flex-wrap gap-2">
        {paths.map((path, index) => (
          <Button
            key={index}
            variant={index === selectedIndex ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectPath(index)}
          >
            경로{index + 1} ({path.info.totalTime}분)
          </Button>
        ))}
      </div>
      {paths[selectedIndex] && <PathDetail path={paths[selectedIndex]} />}
    </CardContent>
  </Card>
)

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, actions }) => {
  const { processedResults, selectedPathIndex1, selectedPathIndex2 } = results
  const { setSelectedPathIndex1, setSelectedPathIndex2 } = actions

  if (!processedResults) return null

  return (
    <div className="mt-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold">탐색 결과</h2>
      <PathCard
        title="1구간 (출발지 → 경유지)"
        paths={processedResults.section1Paths}
        selectedIndex={selectedPathIndex1}
        onSelectPath={setSelectedPathIndex1}
      />
      <PathCard
        title="2구간 (경유지 → 도착지)"
        paths={processedResults.section2Paths}
        selectedIndex={selectedPathIndex2}
        onSelectPath={setSelectedPathIndex2}
      />
    </div>
  )
}

export default ResultsPanel
