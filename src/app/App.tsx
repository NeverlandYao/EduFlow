import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { WorkbenchCanvas } from './components/WorkbenchCanvas';
import { DataHub } from './components/DataHub';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ProfileCenter } from './components/ProfileCenter';
import { AIPortal } from './components/AIPortal';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  const [activeView, setActiveView] = useState('workbench');

  return (
    <TooltipProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-primary/20">
        <TopNav activeView={activeView} onViewChange={setActiveView} />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Subtle background pattern/gradient could go here */}
          <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-[bottom_1px_center] pointer-events-none" />
          
          {activeView === 'workbench' && <WorkbenchCanvas />}
          {activeView === 'portal' && <AIPortal />}
          {activeView === 'knowledge' && <KnowledgeBase />}
          {activeView === 'data' && <DataHub />}
          {activeView === 'profile' && <ProfileCenter />}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;