import { FileCheck, GraduationCap, ChartBar, BookOpen, Plus, ArrowRight, Sparkles, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const templates = [
  {
    id: 'homework-grading',
    name: '作业批改流程',
    description: '全自动化的作业批改工作流，支持多格式上传与智能反馈生成。',
    icon: FileCheck,
    nodes: 4,
    popular: true,
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    date: '2025-12-15',
    author: '官方团队',
    tags: ['自动化', '作业', '高频']
  },
  {
    id: 'exam-analysis',
    name: '考试分析流程',
    description: '深度分析考试数据，自动生成班级与个人维度的分析报告。',
    icon: GraduationCap,
    nodes: 4,
    popular: true,
    color: 'from-purple-500 to-pink-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
    date: '2025-12-10',
    author: '教研组',
    tags: ['数据分析', '考试', '报告']
  },
  {
    id: 'practice-feedback',
    name: '练习反馈流程',
    description: '针对日常练习的快速反馈机制，强化知识点掌握。',
    icon: ChartBar,
    nodes: 3,
    popular: false,
    color: 'from-emerald-500 to-green-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
    date: '2025-11-28',
    author: '数学组',
    tags: ['即时反馈', '练习']
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
    <div className="flex-1 overflow-y-auto bg-background/50 p-8 flex flex-col items-center">
      <div className="max-w-7xl w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              工作流配置
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              选择一个预设模板快速开始，或创建全新的自动化流程。
            </p>
          </div>
          <Button 
            onClick={onCreateFromScratch} 
            size="lg" 
            className="shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all bg-gradient-to-r from-primary to-purple-600 border-0 h-12 px-6 rounded-full font-medium"
          >
            <Plus className="mr-2 h-5 w-5" />
            新建空白流程
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div 
                key={template.id}
                className="group relative flex flex-col h-full bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onSelectTemplate(template.id)}
              >
                {/* Decorative Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${template.color} opacity-[0.03] pointer-events-none`} />
                
                {/* Top Image / Pattern Area */}
                <div className={`h-32 w-full ${template.bgGradient} relative overflow-hidden`}>
                   <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
                   <div className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
                   
                   <div className="absolute top-6 left-6">
                     <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                       <Icon className={`w-7 h-7 ${template.iconColor}`} />
                     </div>
                   </div>

                   {template.popular && (
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-white/90 text-primary dark:bg-black/60 backdrop-blur-md border-0 shadow-sm gap-1.5 px-3 py-1 text-xs font-semibold hover:bg-white">
                        <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                        热门推荐
                      </Badge>
                    </div>
                   )}
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-[10px] font-medium border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Info */}
                  <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                       <Avatar className="w-6 h-6 border border-border">
                         <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                           {template.author[0]}
                         </AvatarFallback>
                       </Avatar>
                       <span className="text-xs">{template.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                       <div className="flex items-center gap-1.5">
                         <div className="flex -space-x-1.5">
                            {[...Array(template.nodes)].map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-br ${template.color} ring-1 ring-background`} />
                            ))}
                         </div>
                         <span>{template.nodes} 步骤</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Hover Action Overlay (Subtle) */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button size="sm" className={`rounded-full shadow-lg bg-gradient-to-r ${template.color} border-0 hover:opacity-90`}>
                    立即使用 <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
