import { useState, useRef, useEffect } from 'react';
import { 
  Upload, ScanText, Sparkles, FileText, Play, Save, 
  Plus, ArrowRight, CircleCheck, CircleAlert, CircleHelp, X, ChevronRight, Loader2, ArrowLeft,
  GraduationCap, BookOpen, ChartBar, Layout,
  ChevronsLeft, ChevronsRight, ZoomIn, ZoomOut, RotateCcw, Terminal, MousePointer2, Eye
} from 'lucide-react';
import { PropertyPanel } from './PropertyPanel';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
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

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
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

const getInitialData = (templateId?: string): { steps: WorkflowStep[], edges: WorkflowEdge[] } => {
  // Initial positions for demo
  const startX = 100;
  const startY = 200;
  const gapX = 250;

  switch (templateId) {
    case 'homework-grading':
      return {
        steps: [
          { id: '1', type: 'upload', name: '上传作业', description: '学生上传作业照片或文档', icon: Upload, configured: true, x: startX, y: startY },
          { id: '3', type: 'ai-grading', name: 'AI批改', description: '根据标准答案自动打分', icon: Sparkles, configured: false, x: startX + gapX, y: startY },
          { id: '4', type: 'export', name: '生成报告', description: '导出批改结果和统计分析', icon: FileText, configured: true, x: startX + gapX * 2, y: startY },
        ],
        edges: [
          { id: 'e1-3', source: '1', target: '3' },
          { id: 'e3-4', source: '3', target: '4' }
        ]
      };
    case 'exam-analysis':
      return {
        steps: [
          { id: '1', type: 'upload', name: '扫描试卷', description: '批量扫描上传考试试卷', icon: Upload, configured: true, x: startX, y: startY },
          { id: '2', type: 'ocr', name: '阅卷识别', description: '识别填空题和客观题答案', icon: ScanText, configured: true, x: startX + gapX, y: startY },
          { id: '3', type: 'ai-grading', name: '自动评分', description: '计算总分及各题得分', icon: Sparkles, configured: true, x: startX + gapX * 2, y: startY },
          { id: '4', type: 'export', name: '错题统计', description: '生成班级错题分布统计', icon: ChartBar, configured: false, x: startX + gapX * 3, y: startY },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
          { id: 'e3-4', source: '3', target: '4' }
        ]
      };
    case 'practice-feedback':
      return {
        steps: [
          { id: '1', type: 'upload', name: '练习收集', description: '收集学生随堂练习', icon: Upload, configured: true, x: startX, y: startY },
          { id: '2', type: 'ai-grading', name: '快速批改', description: 'AI 快速判断对错', icon: Sparkles, configured: false, x: startX + gapX, y: startY },
          { id: '3', type: 'export', name: '即时反馈', description: '发送反馈给学生和家长', icon: FileText, configured: true, x: startX + gapX * 2, y: startY },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' }
        ]
      };
    case 'error-collection':
      return {
        steps: [
          { id: '1', type: 'ocr', name: '错题识别', description: '从作业中提取错题', icon: ScanText, configured: true, x: startX, y: startY },
          { id: '2', type: 'ai-grading', name: '知识点归类', description: '自动标记错题知识点', icon: Sparkles, configured: false, x: startX + gapX, y: startY },
          { id: '3', type: 'export', name: '生成错题本', description: '生成个性化错题集PDF', icon: BookOpen, configured: true, x: startX + gapX * 2, y: startY },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' }
        ]
      };
    default:
      return { steps: [], edges: [] };
  }
};

export function SimplifiedWorkflowCanvas({ templateId, onBack }: SimplifiedWorkflowCanvasProps) {
  const initialData = getInitialData(templateId);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialData.steps);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialData.edges);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedStepId, setDraggedStepId] = useState<string | null>(null);
  
  // Connection State
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [tempConnectionPos, setTempConnectionPos] = useState<{x: number, y: number} | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Canvas Viewport State
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  // UI State
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);

  const handleAddStep = (stepType: any) => {
    // Add new step at center of current viewport
    const clientWidth = canvasRef.current?.clientWidth || 800;
    const clientHeight = canvasRef.current?.clientHeight || 600;
    
    const centerX = (-viewport.x + clientWidth / 2) / viewport.scale;
    const centerY = (-viewport.y + clientHeight / 2) / viewport.scale;

    const newStep: WorkflowStep = {
      id: `${Date.now()}`,
      type: stepType.type,
      name: stepType.name,
      description: stepType.description,
      icon: stepType.icon,
      configured: false,
      x: centerX - 100, // Center the 200px width node
      y: centerY - 32,  // Center the 64px height node
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
    setEdges(edges.filter(e => e.source !== stepId && e.target !== stepId));
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
    }
  };

  const handleStartConnect = (e: React.MouseEvent, stepId: string) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection or drag start
    setConnectingSourceId(stepId);
    
    // Calculate initial temp pos based on mouse or node pos
    // But since mouse move updates it, we just need to set state
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
       const canvasX = (e.clientX - rect.left - viewport.x) / viewport.scale;
       const canvasY = (e.clientY - rect.top - viewport.y) / viewport.scale;
       setTempConnectionPos({ x: canvasX, y: canvasY });
    }
  };

  // Global mouse event listener for connecting
  useEffect(() => {
    if (!connectingSourceId) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - viewport.x) / viewport.scale;
        const canvasY = (e.clientY - rect.top - viewport.y) / viewport.scale;
        setTempConnectionPos({ x: canvasX, y: canvasY });
      }
    };

    const handleWindowMouseUp = (e: MouseEvent) => {
      // If released anywhere not handled by handleEndConnect (which stops propagation),
      // we cancel the connection.
      setConnectingSourceId(null);
      setTempConnectionPos(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [connectingSourceId, viewport]);

  const handleEndConnect = (e: React.MouseEvent, targetStepId: string) => {
    e.stopPropagation(); // Stop propagation so window mouseup doesn't cancel it immediately (though state update batching might handle it, safety first)
    
    if (connectingSourceId && connectingSourceId !== targetStepId) {
      // Check if connection already exists
      const exists = edges.find(edge => 
        (edge.source === connectingSourceId && edge.target === targetStepId) ||
        (edge.source === targetStepId && edge.target === connectingSourceId) // Assuming directed, but prevent duplicates
      );
      
      if (!exists) {
        const newEdge: WorkflowEdge = {
          id: `e${connectingSourceId}-${targetStepId}-${Date.now()}`,
          source: connectingSourceId,
          target: targetStepId
        };
        setEdges([...edges, newEdge]);
      }
    }
    setConnectingSourceId(null);
    setTempConnectionPos(null);
  };

  const handleRemoveEdge = (edgeId: string) => {
    setEdges(edges.filter(e => e.id !== edgeId));
  };

  const handleRun = () => {
    setIsRunning(true);
    setShowLogs(true);
    setLogs(['[系统] 准备运行工作流...', '[系统] 检查节点配置...']);

    let delay = 1000;
    steps.forEach((step, index) => {
      // Set to running
      setTimeout(() => {
        setSteps(prev => prev.map(s => 
          s.id === step.id ? { ...s, status: 'running' } : s
        ));
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 正在执行: ${step.name}...`]);
      }, delay);

      delay += 1500;

      // Set to success
      setTimeout(() => {
        setSteps(prev => prev.map(s => 
          s.id === step.id ? { ...s, status: 'success' } : s
        ));
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ ${step.name} 执行完成`]);
      }, delay);
      
      delay += 500;
    });

    setTimeout(() => {
      setIsRunning(false);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🎉 工作流执行完毕！`]);
    }, delay + 500);
  };

  // Canvas Interactions
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Middle click or Space+Left Click (simulated here just by clicking background)
    if (e.button === 0 || e.button === 1) {
      setIsDraggingCanvas(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }

    if (connectingSourceId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - viewport.x) / viewport.scale;
      const canvasY = (e.clientY - rect.top - viewport.y) / viewport.scale;
      setTempConnectionPos({ x: canvasX, y: canvasY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
    // If we were connecting and released mouse on canvas (not on a node), cancel connection
    if (connectingSourceId) {
      setConnectingSourceId(null);
      setTempConnectionPos(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom with scroll
    if (e.ctrlKey || e.metaKey || true) { // Always zoom on wheel for now as it's a canvas app
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(0.2, viewport.scale + delta), 3);
      
      setViewport(prev => ({ ...prev, scale: newScale }));
    }
  };

  const handleResetView = () => {
    setViewport({ x: 0, y: 0, scale: 1 });
  };

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    e.stopPropagation(); // Prevent canvas drag
    setDraggedStepId(stepId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedStepId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Apply inverse transform to get canvas coordinates
      const canvasX = (mouseX - viewport.x) / viewport.scale;
      const canvasY = (mouseY - viewport.y) / viewport.scale;

      setSteps(prev => prev.map(s => 
        s.id === draggedStepId ? { ...s, x: canvasX - 100, y: canvasY - 32 } : s
      ));
      setDraggedStepId(null);
    }
  };

  const isWorkflowValid = steps.length > 0 && steps.every(s => s.configured);

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background">
      {/* Left Sidebar: Node Palette */}
      <div 
        className={cn(
          "border-r border-border bg-background flex flex-col z-20 shadow-sm transition-all duration-300 overflow-hidden",
          showLeftSidebar ? "w-64" : "w-0 opacity-0"
        )}
      >
        <div className="p-4 border-b border-border flex justify-between items-center min-w-[250px]">
          <div>
            <h3 className="font-bold text-lg">节点库</h3>
            <p className="text-xs text-muted-foreground mt-1">点击添加节点，拖拽连接线</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowLeftSidebar(false)}>
            <ChevronsLeft className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4 min-w-[250px]">
          <div className="space-y-6">
            {/* Input Nodes */}
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

            {/* Process Nodes */}
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

            {/* Output Nodes */}
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
        {/* Toggle Sidebar Buttons (When closed) */}
        {!showLeftSidebar && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute left-4 top-20 z-30 shadow-md"
            onClick={() => setShowLeftSidebar(true)}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        )}
        
        {!showRightSidebar && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute right-4 top-20 z-30 shadow-md"
            onClick={() => setShowRightSidebar(true)}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
        )}

        {/* Top Toolbar */}
        <div className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
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
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 ml-4">
               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewport(prev => ({...prev, scale: Math.max(0.2, prev.scale - 0.1)}))}>
                 <ZoomOut className="w-3 h-3" />
               </Button>
               <span className="text-xs w-12 text-center">{Math.round(viewport.scale * 100)}%</span>
               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewport(prev => ({...prev, scale: Math.min(3, prev.scale + 0.1)}))}>
                 <ZoomIn className="w-3 h-3" />
               </Button>
               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleResetView} title="重置视图">
                 <RotateCcw className="w-3 h-3" />
               </Button>
            </div>
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
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={handleWheel}
        >
           {/* Transformed Content */}
           <div 
             className="absolute inset-0 transform-gpu origin-top-left"
             style={{ 
               transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
               width: '100%',
               height: '100%'
             }}
           >
             {/* Infinite Grid Pattern */}
             <div className="absolute -inset-[2000%] opacity-[0.4] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                    backgroundSize: '20px 20px',
                    transform: `scale(${1/viewport.scale})` // Keep dots consistent size visually? Or scale them? Let's scale them naturally
                  }} 
             />
             
             {/* We need a large area for the grid, but 'absolute inset-0' only covers the viewport. 
                 For infinite canvas, we usually render grid based on viewport offset. 
                 For simplicity here, we just let the grid scale with the content container. 
             */}
             
             {/* Steps */}
             {steps.map((step, index) => {
               const Icon = step.icon;
               const isSelected = selectedStep?.id === step.id;
               
               return (
                 <div
                   key={step.id}
                   className={cn(
                     "absolute w-[200px] p-0 rounded-lg border-2 shadow-sm bg-background transition-shadow group z-10",
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
                    setShowLogs(false);
                    setShowRightSidebar(true);
                  }}
                  onMouseDown={(e) => e.stopPropagation()} // Prevent canvas drag when clicking node
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
                   <div 
                     className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] flex items-center justify-center cursor-crosshair z-30"
                     onMouseDown={(e) => handleStartConnect(e, step.id)}
                     onMouseUp={(e) => handleEndConnect(e, step.id)}
                     onClick={(e) => e.stopPropagation()}
                     onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                   >
                      <div className="w-[10px] h-[10px] rounded-full bg-background border-2 border-muted-foreground/50 hover:border-primary transition-colors" />
                   </div>
                   <div 
                     className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] flex items-center justify-center cursor-crosshair z-30"
                     onMouseDown={(e) => handleStartConnect(e, step.id)}
                     onMouseUp={(e) => handleEndConnect(e, step.id)}
                     onClick={(e) => e.stopPropagation()}
                     onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                   >
                      <div className="w-[10px] h-[10px] rounded-full bg-background border-2 border-muted-foreground/50 hover:border-primary transition-colors" />
                   </div>

                   {/* Delete Button */}
                   <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStep(step.id);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20"
                    >
                      <X className="w-3 h-3" />
                    </button>

                   {/* Quick Actions (e.g. Report Preview) */}
                   {step.type === 'export' && step.status === 'success' && (
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReportPreview(true);
                        }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center gap-1 shadow-md hover:bg-primary/90 transition-all z-20 animate-in fade-in zoom-in duration-300"
                      >
                        <Eye className="w-3 h-3" />
                        查看报告
                      </button>
                   )}
                 </div>
               );
             })}

             {/* Connecting Lines */}
             <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible">
               <defs>
                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                 </marker>
               </defs>
               
               {/* Existing Edges */}
               {edges.map((edge) => {
                 const sourceStep = steps.find(s => s.id === edge.source);
                 const targetStep = steps.find(s => s.id === edge.target);
                 
                 if (sourceStep && targetStep) {
                   const startX = sourceStep.x + 200;
                   const startY = sourceStep.y + 32;
                   const endX = targetStep.x;
                   const endY = targetStep.y + 32;
                   
                   const deltaX = endX - startX;
                   const controlPointX = startX + deltaX / 2;
                   
                   const path = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;
                   
                   // Calculate midpoint for delete button
                   // Bezier curve midpoint approximation is complex, simplified to linear midpoint for UI
                   const midX = (startX + endX) / 2;
                   const midY = (startY + endY) / 2;

                   return (
                     <g key={edge.id} className="group/edge pointer-events-auto">
                      <path 
                        d={path}
                        fill="none"
                        stroke="#cbd5e1" 
                        strokeWidth="2" 
                        markerEnd="url(#arrowhead)"
                        className="group-hover/edge:stroke-primary group-hover/edge:stroke-[3px] transition-all cursor-pointer"
                      />
                      {/* Invisible wider path for easier hovering */}
                      <path 
                        d={path}
                        fill="none"
                        stroke="transparent" 
                        strokeWidth="15" 
                      />
                      
                      {/* Delete Button on Edge */}
                      <foreignObject x={midX - 10} y={midY - 10} width="20" height="20" className="opacity-0 group-hover/edge:opacity-100 transition-opacity">
                        <div 
                          className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEdge(edge.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </div>
                      </foreignObject>
                     </g>
                   );
                 }
                 return null;
               })}

               {/* Temporary Connection Line */}
               {connectingSourceId && tempConnectionPos && (() => {
                 const sourceStep = steps.find(s => s.id === connectingSourceId);
                 if (sourceStep) {
                   const startX = sourceStep.x + 200; // Assume dragging from right for now, logic can be improved
                   const startY = sourceStep.y + 32;
                   const endX = tempConnectionPos.x;
                   const endY = tempConnectionPos.y;

                   const deltaX = endX - startX;
                   const controlPointX = startX + deltaX / 2;
                   
                   const path = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;

                   return (
                     <path 
                        d={path}
                        fill="none"
                        stroke="#3b82f6" 
                        strokeWidth="2" 
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                      />
                   );
                 }
                 return null;
               })()}
             </svg>
           </div>
        </div>
        
        {/* Logs Panel - Removed from bottom */}
      </div>

      {/* Right Sidebar: Configuration or Logs */}
      <div 
        className={cn(
          "border-l border-border bg-background flex flex-col shadow-sm z-20 transition-all duration-300 overflow-hidden",
          showRightSidebar ? "w-80" : "w-0 opacity-0"
        )}
      >
        <div className="flex-1 flex flex-col h-full min-w-[320px]">
          {showLogs ? (
            <div className="flex-1 flex flex-col h-full">
               <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <Terminal className="w-5 h-5" />
                    运行日志
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowRightSidebar(false)}>
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
               </div>
               <ScrollArea className="flex-1 p-4 font-mono text-xs">
                 <div className="space-y-2">
                   {logs.map((log, i) => (
                     <div key={i} className="text-muted-foreground border-b border-border/30 pb-2 last:border-0 break-words">
                       {log}
                     </div>
                   ))}
                   <div id="log-end" />
                 </div>
               </ScrollArea>
            </div>
          ) : selectedStep ? (
            <>
               <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-bold text-lg">节点配置</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowRightSidebar(false)}>
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
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
            </>
          ) : (
            <div className="flex-1 flex flex-col h-full items-center justify-center text-center p-8 text-muted-foreground relative">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setShowRightSidebar(false)}>
                 <ChevronsRight className="w-4 h-4" />
              </Button>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm">点击画布中的节点以配置参数</p>
              <p className="text-xs mt-2 opacity-60">或从左侧添加新节点</p>
            </div>
          )}
        </div>
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
