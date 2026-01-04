import { FileCheck, GraduationCap, ChartBar, BookOpen, Plus, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const templates = [
  {
    id: 'homework-grading',
    name: '作业批改流程',
    description: '全自动化的作业批改工作流，支持多格式上传与智能反馈生成。',
    icon: FileCheck,
    nodes: 4,
    popular: true,
    color: 'bg-blue-500/10 text-blue-600',
    date: '2025-12-15',
  },
  {
    id: 'exam-analysis',
    name: '考试分析流程',
    description: '深度分析考试数据，自动生成班级与个人维度的分析报告。',
    icon: GraduationCap,
    nodes: 4,
    popular: true,
    color: 'bg-purple-500/10 text-purple-600',
    date: '2025-12-10',
  },
  {
    id: 'practice-feedback',
    name: '练习反馈流程',
    description: '针对日常练习的快速反馈机制，强化知识点掌握。',
    icon: ChartBar,
    nodes: 3,
    popular: false,
    color: 'bg-green-500/10 text-green-600',
    date: '2025-11-28',
  },
  {
    id: 'error-collection',
    name: '错题本生成',
    description: '智能识别错题并自动归类，生成个性化复习资料。',
    icon: BookOpen,
    nodes: 3,
    popular: false,
    color: 'bg-orange-500/10 text-orange-600',
    date: '2025-11-20',
  },
];

interface WorkflowTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
  onCreateFromScratch: () => void;
}

export function WorkflowTemplates({ onSelectTemplate, onCreateFromScratch }: WorkflowTemplatesProps) {
  // Sort templates by date descending
  const sortedTemplates = [...templates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex-1 overflow-y-auto bg-secondary/30 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">工作流配置</h1>
            <p className="text-muted-foreground mt-1">
              选择一个预设模板快速开始，或创建全新的自动化流程
            </p>
          </div>
          <Button 
            onClick={onCreateFromScratch} 
            size="lg" 
            className="shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            新建空白流程
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id}
                className="group relative border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm flex flex-col"
                onClick={() => onSelectTemplate(template.id)}
              >
                {template.popular && (
                  <div className="absolute top-0 right-0 p-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 gap-1">
                      <Sparkles className="h-3 w-3" />
                      推荐
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${template.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 h-10">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px]">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <span>{template.nodes} 步骤</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                       <Calendar className="w-3 h-3" />
                       {template.date}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    使用此模板
                    <ArrowRight className="w-4 h-4 -translate-x-2 group-hover:translate-x-0 transition-transform duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}

          {/* Create New Card (Visual Alternative) */}
          <Card 
            className="group border-dashed border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 min-h-[300px]"
            onClick={onCreateFromScratch}
          >
            <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
              <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">新建空白流程</h3>
              <p className="text-muted-foreground text-sm mt-1">从零开始设计您的工作流</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
