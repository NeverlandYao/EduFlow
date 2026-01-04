import { useState, useRef } from 'react';
import { 
  Upload, ScanText, Sparkles, FileText, Play, Save, 
  Plus, ArrowRight, CircleCheck, CircleAlert, CircleHelp, X, ChevronRight, Loader2, ArrowLeft,
  GraduationCap, BookOpen, ChartBar, Layout,
  ChevronsLeft, ChevronsRight, ZoomIn, ZoomOut, RotateCcw, Terminal, MousePointer2
} from 'lucide-react';
import { PropertyPanel } from './PropertyPanel';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from './ui/utils';

export interface SimplifiedWorkflowCanvasProps {
  templateId?: string;
  onBack?: () => void;
}

interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  status?: 'idle' | 'running' | 'success' | 'error';
  configured: boolean;
  x: number;
  y: number;
}

const StepTypes = [
  { 
    type: 'upload', 
    name: '上传作业', 
    description: '支持多种格式上传',
    icon: Upload,
    usageHint: '支持照片、PDF等多种格式'
  },
  { 
    type: 'ocr', 
    name: '输入文本', 
    description: '手动输入或识别',
    icon: FileText,
    usageHint: '直接输入文本内容'
  },
  { 
    type: 'ai-grading', 
    name: 'AI批改', 
    description: '自动打分与点评',
    icon: Sparkles,
    usageHint: '需要配置批改规则和标准答案'
  },
  { 
    type: 'rule-match', 
    name: '规则匹配', 
    description: '基于规则的判断',
    icon: ScanText,
    usageHint: '设置自定义规则'
  },
  { 
    type: 'export', 
    name: '生成报告', 
    description: '导出分析结果',
    icon: FileText,
    usageHint: '可选择导出格式和内容'
  },
  { 
    type: 'export-score', 
    name: '导出成绩', 
    description: '导出成绩单',
    icon: Upload,
    usageHint: '导出Excel表格'
  },
];

const getInitialSteps = (templateId?: string): WorkflowStep[] => {
  // Initial positions for demo
  const startX = 100;
  const startY = 200;
  const gapX = 250;

  switch (templateId) {
    case 'homework-grading':
      return [
        { id: '1', type: 'upload', name: '上传作业', description: '学生上传作业照片或文档', icon: Upload, configured: true, x: startX, y: startY },
        { id: '3', type: 'ai-grading', name: 'AI批改', description: '根据标准答案自动打分', icon: Sparkles, configured: false, x: startX + gapX, y: startY },
        { id: '4', type: 'export', name: '生成报告', description: '导出批改结果和统计分析', icon: FileText, configured: true, x: startX + gapX * 2, y: startY },
      ];
    case 'exam-analysis':
      return [
        { id: '1', type: 'upload', name: '扫描试卷', description: '批量扫描上传考试试卷', icon: Upload, configured: true, x: startX, y: startY },
        { id: '2', type: 'ocr', name: '阅卷识别', description: '识别填空题和客观题答案', icon: ScanText, configured: true, x: startX + gapX, y: startY },
        { id: '3', type: 'ai-grading', name: '自动评分', description: '计算总分及各题得分', icon: Sparkles, configured: true, x: startX + gapX * 2, y: startY },
        { id: '4', type: 'export', name: '错题统计', description: '生成班级错题分布统计', icon: ChartBar, configured: false, x: startX + gapX * 3, y: startY },
      ];
    case 'practice-feedback':
      return [
        { id: '1', type: 'upload', name: '练习收集', description: '收集学生随堂练习', icon: Upload, configured: true, x: startX, y: startY },
        { id: '2', type: 'ai-grading', name: '快速批改', description: 'AI 快速判断对错', icon: Sparkles, configured: false, x: startX + gapX, y: startY },
        { id: '3', type: 'export', name: '即时反馈', description: '发送反馈给学生和家长', icon: FileText, configured: true, x: startX + gapX * 2, y: startY },
      ];
    case 'error-collection':
      return [
        { id: '1', type: 'ocr', name: '错题识别', description: '从作业中提取错题', icon: ScanText, configured: true, x: startX, y: startY },
        { id: '2', type: 'ai-grading', name: '知识点归类', description: '自动标记错题知识点', icon: Sparkles, configured: false, x: startX + gapX, y: startY },
        { id: '3', type: 'export', name: '生成错题本', description: '生成个性化错题集PDF', icon: BookOpen, configured: true, x: startX + gapX * 2, y: startY },
      ];
    default:
      return [];
  }
};

export function SimplifiedWorkflowCanvas({ templateId, onBack }: SimplifiedWorkflowCanvasProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(getInitialSteps(templateId));
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedStepId, setDraggedStepId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddStep = (stepType: any) => {
    // Add new step at a default position or near the center of the viewport
    const newStep: WorkflowStep = {
      id: `${Date.now()}`,
      type: stepType.type,
      name: stepType.name,
      description: stepType.description,
      icon: stepType.icon,
      configured: false,
      x: 100, // Default start position
      y: 100,
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    // Simple simulation
    steps.forEach((step, index) => {
      setTimeout(() => {
        setSteps(prev => prev.map(s => 
          s.id === step.id ? { ...s, status: 'running' } : s
        ));
        setTimeout(() => {
          setSteps(prev => prev.map(s => 
            s.id === step.id ? { ...s, status: 'success' } : s
          ));
        }, 800);
      }, index * 1000);
    });

    setTimeout(() => setIsRunning(false), steps.length * 1000 + 1000);
  };

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    setDraggedStepId(stepId);
    e.dataTransfer.effectAllowed = 'move';
    // Calculate offset if needed, for simplicity we just use the cursor
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedStepId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 100; // Center the node roughly
      const y = e.clientY - rect.top - 30;

      setSteps(prev => prev.map(s => 
        s.id === draggedStepId ? { ...s, x, y } : s
      ));
      setDraggedStepId(null);
    }
  };

  const isWorkflowValid = steps.length > 0 && steps.every(s => s.configured);

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background">
      {/* Left Sidebar: Node Palette */}
      <div className="w-64 border-r border-border bg-background flex flex-col z-20 shadow-sm">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-lg">节点库</h3>
          <p className="text-xs text-muted-foreground mt-1">点击添加节点，拖拽连接线创建工作流</p>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-3">输入节点</h4>
              <div className="space-y-2">
                {StepTypes.filter(t => ['upload', 'ocr'].includes(t.type)).map(type => {
                   const Icon = type.icon;
                   return (
                    <div 
                      key={type.type}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-pointer transition-all active:scale-95"
                      onClick={() => handleAddStep(type)}
                    >
                      <Icon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                   )
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-3">处理节点</h4>
              <div className="space-y-2">
                {StepTypes.filter(t => ['ai-grading', 'rule-match'].includes(t.type)).map(type => {
                   const Icon = type.icon;
                   return (
                    <div 
                      key={type.type}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-pointer transition-all active:scale-95"
                      onClick={() => handleAddStep(type)}
                    >
                      <Icon className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                   )
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-3">输出节点</h4>
              <div className="space-y-2">
                {StepTypes.filter(t => ['export', 'export-score'].includes(t.type)).map(type => {
                   const Icon = type.icon;
                   return (
                    <div 
                      key={type.type}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-pointer transition-all active:scale-95"
                      onClick={() => handleAddStep(type)}
                    >
                      <Icon className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                   )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#f8fafc] dark:bg-[#0f172a]">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack} className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                <ArrowLeft className="w-4 h-4" />
                返回模板列表
              </Button>
            )}
            <div className="h-6 w-[1px] bg-border mx-2" />
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              保存工作流
            </Button>
            <Button variant="outline" size="sm">
              另存为模板
            </Button>
          </div>
          <div className="flex gap-3">
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              试运行
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
              发布
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
           {/* Dot Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
           />

           {/* Nodes */}
           {steps.map((step, index) => {
             const Icon = step.icon;
             const isSelected = selectedStep?.id === step.id;
             
             return (
               <div
                 key={step.id}
                 className={cn(
                   "absolute w-[200px] p-0 rounded-lg border-2 shadow-sm bg-background cursor-move transition-shadow group z-10",
                   isSelected ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border hover:border-primary/50",
                   step.status === 'running' && "border-blue-500 ring-2 ring-blue-500/20",
                   step.status === 'success' && "border-green-500 ring-2 ring-green-500/20"
                 )}
                 style={{ left: step.x, top: step.y }}
                 draggable
                 onDragStart={(e) => handleDragStart(e, step.id)}
                 onClick={(e) => {
                   e.stopPropagation();
                   setSelectedStep(step);
                 }}
               >
                 <div className="flex items-center p-3 gap-3">
                   <div className={cn(
                     "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                     step.type.includes('upload') || step.type.includes('ocr') ? "bg-blue-50 text-blue-600" :
                     step.type.includes('ai') || step.type.includes('rule') ? "bg-green-50 text-green-600" :
                     "bg-orange-50 text-orange-600"
                   )}>
                     <Icon className="w-5 h-5" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="font-medium text-sm truncate">{step.name}</div>
                     <div className="text-xs text-muted-foreground truncate">{step.description}</div>
                   </div>
                 </div>
                 
                 {/* Connection Points */}
                 <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-background border-2 border-muted-foreground/50 hover:border-primary cursor-crosshair z-20" />
                 <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-background border-2 border-muted-foreground/50 hover:border-primary cursor-crosshair z-20" />

                 {/* Delete Button */}
                 <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStep(step.id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
               </div>
             );
           })}

           {/* Simple Connecting Lines (Visual Only for Demo) */}
           <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible">
             <defs>
               <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                 <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
               </marker>
             </defs>
             {steps.slice(0, -1).map((step, i) => {
               const nextStep = steps[i + 1];
               // Only draw if next step exists
               if (nextStep) {
                 const startX = step.x + 200;
                 const startY = step.y + 32; // Center Y
                 const endX = nextStep.x;
                 const endY = nextStep.y + 32;
                 
                 const deltaX = endX - startX;
                 const controlPointX = startX + deltaX / 2;
                 
                 // Bezier curve
                 const path = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;
                 
                 return (
                   <g key={`line-${step.id}-${nextStep.id}`}>
                    <path 
                      d={path}
                      fill="none"
                      stroke="#cbd5e1" 
                      strokeWidth="2" 
                      markerEnd="url(#arrowhead)"
                    />
                   </g>
                 );
               }
               return null;
             })}
           </svg>
        </div>
      </div>

      {/* Right Sidebar: Configuration */}
      <div className="w-80 border-l border-border bg-background flex flex-col shadow-sm z-20">
        {selectedStep ? (
          <div className="flex-1 flex flex-col h-full">
             <div className="p-4 border-b border-border">
                <h3 className="font-bold text-lg">节点配置</h3>
             </div>
             <div className="flex-1 overflow-hidden">
                <PropertyPanel 
                  node={{ ...selectedStep, label: selectedStep.name }} 
                  onClose={() => setSelectedStep(null)}
                  onUpdate={(updatedNode) => {
                    setSteps(steps.map(s => 
                      s.id === selectedStep.id ? { 
                        ...s, 
                        name: updatedNode.label, 
                        configured: updatedNode.configured 
                      } : s
                    ));
                    setSelectedStep(prev => prev ? { ...prev, name: updatedNode.label, configured: updatedNode.configured } : null);
                  }}
                />
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full items-center justify-center text-center p-8 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm">点击画布中的节点以配置参数</p>
            <p className="text-xs mt-2 opacity-60">或从左侧添加新节点</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
