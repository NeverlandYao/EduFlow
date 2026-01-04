import { useState } from 'react';
import { WorkflowTemplates } from './WorkflowTemplates';
import { SimplifiedWorkflowCanvas } from './SimplifiedWorkflowCanvas';
import { AgentConfiguration } from './AgentConfiguration';
import { AgentTemplates } from './AgentTemplates';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Workflow, Bot, Settings } from 'lucide-react';

export function WorkbenchCanvas() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAgentTemplate, setSelectedAgentTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('workflow');

  // Workflow Handlers
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateFromScratch = () => {
    setSelectedTemplate('blank');
  };

  const handleBack = () => {
    setSelectedTemplate(null);
  };

  // Agent Handlers
  const handleSelectAgentTemplate = (template: any) => {
    setSelectedAgentTemplate(template);
  };

  const handleCreateAgentFromScratch = () => {
    setSelectedAgentTemplate({ name: '新智能体', prompt: '' });
  };

  const handleAgentBack = () => {
    setSelectedAgentTemplate(null);
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-secondary/30">
      {/* Secondary Sidebar */}
      <div className="w-64 bg-background border-r border-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold px-2">工作台</h2>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            <Button 
              variant={activeTab === 'workflow' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3 font-normal"
              onClick={() => setActiveTab('workflow')}
            >
              <Workflow className="w-4 h-4 text-muted-foreground" />
              工作流配置
            </Button>
            <Button 
              variant={activeTab === 'agent' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3 font-normal"
              onClick={() => setActiveTab('agent')}
            >
              <Bot className="w-4 h-4 text-muted-foreground" />
              智能体配置
            </Button>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" />
            工作台设置
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {activeTab === 'workflow' ? (
            !selectedTemplate ? (
              <WorkflowTemplates 
                onSelectTemplate={handleSelectTemplate}
                onCreateFromScratch={handleCreateFromScratch}
              />
            ) : (
              <SimplifiedWorkflowCanvas templateId={selectedTemplate} onBack={handleBack} />
            )
          ) : (
            !selectedAgentTemplate ? (
              <AgentTemplates 
                onSelectTemplate={handleSelectAgentTemplate}
                onCreateFromScratch={handleCreateAgentFromScratch}
              />
            ) : (
              <AgentConfiguration initialData={selectedAgentTemplate} onBack={handleAgentBack} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
