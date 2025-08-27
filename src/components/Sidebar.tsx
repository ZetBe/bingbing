// src/components/Sidebar.tsx

import { ScrollArea } from '@/components/ui/scroll-area'
import ControlPanel from './ControlPanel'
import ResultsPanel from './ResultsPanel'
import { useTransitSearch } from '@/hooks/useTransitSearch'

// props 타입을 useTransitSearch의 반환 타입으로 정의
type SidebarProps = ReturnType<typeof useTransitSearch>

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <aside className="w-[400px] flex-shrink-0 border-r">
      <ScrollArea className="h-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">빙빙</h1>
        </div>
        <ControlPanel
          points={props.points}
          uiState={props.uiState}
          actions={props.actions}
        />
        <ResultsPanel results={props.results} actions={props.actions} />
      </ScrollArea>
    </aside>
  )
}

export default Sidebar
