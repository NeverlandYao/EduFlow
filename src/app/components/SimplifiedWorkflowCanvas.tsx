import { useState } from 'react';
import { 
  Upload, ScanText, Sparkles, FileText, Play, Save, 
  Plus, ArrowRight, CircleCheck, CircleAlert, CircleHelp, X, ChevronRight, Loader2, ArrowLeft,
  GraduationCap, BookOpen, ChartBar
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
}

const StepTypes = [
  { 
    type: 'upload', 
    name: '收作业', 
    description: '学生上传作业照片或文档',
    icon: Upload,
    usageHint: '支持照片、PDF等多种格式'
  },
  { 
    type: 'ocr', 
    name: '自动识别', 
    description: '识别作业内容和学生信息',
    icon: ScanText,
    usageHint: '自动提取文字和答案'
  },
  { 
    type: 'ai-grading', 
    name: '智能批改', 
    description: '根据标准答案自动打分',
    icon: Sparkles,
    usageHint: '需要配置批改规则和标准答案'
  },
  { 
    type: 'export', 
    name: '生成报告', 
    description: '导出批改结果和统计分析',
    icon: FileText,
    usageHint: '可选择导出格式和内容'
  },
];

const getInitialSteps = (templateId?: string): WorkflowStep[] => {
  switch (templateId) {
    case 'homework-grading':
      return [
        { id: '1', type: 'upload', name: '收作业', description: '学生上传作业照片或文档', icon: Upload, configured: true },
        { id: '2', type: 'ocr', name: '自动识别', description: '识别作业内容和学生信息', icon: ScanText, configured: true },
        { id: '3', type: 'ai-grading', name: '智能批改', description: '根据标准答案自动打分', icon: Sparkles, configured: false },
        { id: '4', type: 'export', name: '生成报告', description: '导出批改结果和统计分析', icon: FileText, configured: true },
      ];
    case 'exam-analysis':
      return [
        { id: '1', type: 'upload', name: '扫描试卷', description: '批量扫描上传考试试卷', icon: Upload, configured: true },
        { id: '2', type: 'ocr', name: '阅卷识别', description: '识别填空题和客观题答案', icon: ScanText, configured: true },
        { id: '3', type: 'ai-grading', name: '自动评分', description: '计算总分及各题得分', icon: Sparkles, configured: true },
        { id: '4', type: 'export', name: '错题统计', description: '生成班级错题分布统计', icon: ChartBar, configured: false },
      ];
    case 'practice-feedback':
      return [
        { id: '1', type: 'upload', name: '练习收集', description: '收集学生随堂练习', icon: Upload, configured: true },
        { id: '2', type: 'ai-grading', name: '快速批改', description: 'AI 快速判断对错', icon: Sparkles, configured: false },
        { id: '3', type: 'export', name: '即时反馈', description: '发送反馈给学生和家长', icon: FileText, configured: true },
      ];
    case 'error-collection':
      return [
        { id: '1', type: 'ocr', name: '错题识别', description: '从作业中提取错题', icon: ScanText, configured: true },
        { id: '2', type: 'ai-grading', name: '知识点归类', description: '自动标记错题知识点', icon: Sparkles, configured: false },
        { id: '3', type: 'export', name: '生成错题本', description: '生成个性化错题集PDF', icon: BookOpen, configured: true },
      ];
    default:
      return [];
  }
};

export function SimplifiedWorkflowCanvas({ templateId, onBack }: SimplifiedWorkflowCanvasProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(getInitialSteps(templateId));
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleAddStep = (afterStepId: string | null, stepType: any) => {
    const newStep: WorkflowStep = {
      id: `${Date.now()}`,
      type: stepType.type,
      name: stepType.name,
      description: stepType.description,
      icon: stepType.icon,
      configured: false,
    };

    if (afterStepId === null) {
      setSteps([newStep]);
    } else {
      const index = steps.findIndex(s => s.id === afterStepId);
      const newSteps = [...steps];
      newSteps.splice(index + 1, 0, newStep);
      setSteps(newSteps);
    }
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
    }
  };

  const handleRun = () => {
    // Validate first
    const unconfigured = steps.filter(s => !s.configured);
    if (unconfigured.length > 0) {
      setShowValidation(true);
      return;
    }

    setIsRunning(true);
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

  const isWorkflowValid = steps.length > 0 && steps.every(s => s.configured);
  const unconfiguredSteps = steps.filter(s => !s.configured);

  const getRecommendedSteps = (afterStepId: string | null) => {
    if (afterStepId === null || steps.length === 0) {
      return StepTypes.filter(t => t.type === 'upload');
    }
    
    const currentStep = steps.find(s => s.id === afterStepId);
    if (!currentStep) return StepTypes;

    if (currentStep.type === 'upload') return StepTypes.filter(t => t.type === 'ocr');
    if (currentStep.type === 'ocr') return StepTypes.filter(t => t.type === 'ai-grading');
    if (currentStep.type === 'ai-grading') return StepTypes.filter(t => t.type === 'export');
    
    return StepTypes;
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background">
      {/* Left Sidebar: Node Palette */}
      <div className="w-64 border-r border-border bg-secondary/20 flex flex-col">
        <div className="p-4 border-b border-border bg-card/50">
          <h3 className="font-semibold text-sm">节点库</h3>
          <p className="text-xs text-muted-foreground mt-1">点击或拖拽添加节点</p>
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {StepTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.type}>
                  <Card 
                    className="p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all group active:scale-95"
                    onClick={() => handleAddStep(null, type)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{type.description}</div>
                      </div>
                      <Plus className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Middle: Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Toolbar */}
        <div className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-sm font-semibold">新建工作流</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={isWorkflowValid ? "text-green-600" : "text-yellow-600"}>
                  {isWorkflowValid ? "准备就绪" : `${unconfiguredSteps.length} 个未配置`}
                </span>
                <span>•</span>
                <span>{steps.length} 个步骤</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              保存
            </Button>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 bg-secondary/30 p-8 overflow-y-auto relative">
           {/* Grid Background Pattern */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
           />

          <div className="max-w-3xl mx-auto space-y-8 pb-20 relative z-0">
            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted-foreground/20 rounded-xl bg-card/50">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                  <Plus className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-medium mb-2">画布为空</h3>
                <p className="text-muted-foreground">从左侧选择节点添加到此处</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isSelected = selectedStep?.id === step.id;
                  
                  return (
                    <div key={step.id} className="relative group">
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className="absolute left-8 top-16 bottom-[-16px] w-[2px] bg-border group-hover:bg-primary/20 transition-colors z-0" />
                      )}

                      <Card 
                        onClick={() => setSelectedStep(step)}
                        className={cn(
                          "relative z-10 transition-all duration-200 cursor-pointer border-2 hover:shadow-md",
                          isSelected ? "border-primary shadow-lg shadow-primary/5" : "border-transparent hover:border-border",
                          step.status === 'running' && "ring-2 ring-primary ring-offset-2",
                          step.status === 'success' && "ring-2 ring-green-500 ring-offset-2 border-green-500/20",
                          step.status === 'error' && "ring-2 ring-destructive ring-offset-2 border-destructive/20"
                        )}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          {/* Step Number Badge */}
                          <div className={cn(
                            "absolute -left-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-20",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"
                          )}>
                            {index + 1}
                          </div>

                          {/* Icon Box */}
                          <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            step.status === 'success' ? "bg-green-500 text-white" :
                            step.status === 'error' ? "bg-destructive text-white" :
                            isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{step.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{step.description}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {step.configured ? (
                              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">已配置</Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">待配置</Badge>
                            )}
                            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", isSelected && "rotate-90")} />
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveStep(step.id);
                            }}
                            className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:scale-110"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Configuration & Test */}
      <div className="w-80 border-l border-border bg-background flex flex-col shadow-xl z-20">
        {selectedStep ? (
          <div className="flex-1 flex flex-col h-full">
             <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
                <h3 className="font-semibold text-sm">节点配置</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedStep(null)}>
                  <X className="w-4 h-4" />
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
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b border-border bg-card/50">
              <h3 className="font-semibold text-sm">运行测试</h3>
              <p className="text-xs text-muted-foreground mt-1">调试和预览工作流结果</p>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                 <Play className="w-8 h-8 text-muted-foreground" />
               </div>
               <h4 className="font-medium mb-2">准备就绪</h4>
               <p className="text-sm text-muted-foreground mb-6">
                 {isWorkflowValid 
                   ? "所有步骤配置完成，可以开始运行测试。" 
                   : "请先完成所有节点的配置。"}
               </p>
               <Button 
                onClick={handleRun}
                disabled={!isWorkflowValid || isRunning}
                className="w-full gap-2 shadow-lg shadow-primary/20"
                size="lg"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isRunning ? '运行中...' : '开始运行'}
              </Button>
            </div>
            {/* Simulation Log Area */}
             <div className="h-1/3 border-t border-border bg-secondary/20 p-4 overflow-y-auto">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">运行日志</h4>
                <div className="space-y-2 font-mono text-xs">
                  {isRunning && <div className="text-blue-600">&gt; 开始执行工作流...</div>}
                  {steps.filter(s => s.status === 'success').map(s => (
                    <div key={s.id} className="text-green-600">&gt; [{s.name}] 执行成功</div>
                  ))}
                   {steps.some(s => s.status === 'running') && (
                    <div className="text-orange-600 animate-pulse">&gt; 正在执行...</div>
                  )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
