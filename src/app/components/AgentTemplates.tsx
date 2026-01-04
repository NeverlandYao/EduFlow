import { Bot, GraduationCap, Languages, Calculator, Code, Plus, ArrowRight, Sparkles, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const agentTemplates = [
  {
    id: 'teaching-assistant',
    name: '全能助教',
    description: '辅助教师进行备课、答疑、作业设计等多场景任务。',
    icon: GraduationCap,
    skills: ['教案生成', '多轮对话', '知识库问答'],
    popular: true,
    color: 'from-indigo-500 to-violet-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30',
    prompt: '你是一位经验丰富的全能助教。你的任务是辅助教师完成日常教学工作，包括但不限于备课建议、学生答疑、作业设计和试题生成。请保持专业、耐心且富有教育意义的语气。',
    date: '2024-03-12',
    author: '官方团队'
  },
  {
    id: 'exam-helper',
    name: '出题专家',
    description: '根据指定知识点和难度，自动生成高质量试题和解析。',
    icon: Code,
    skills: ['试题生成', '答案解析', '难度分级'],
    popular: true,
    color: 'from-pink-500 to-rose-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
    prompt: '你是一位专业的出题专家。请根据用户提供的知识点、题型和难度要求，生成结构严谨、逻辑清晰的试题。每道题都应包含标准答案和详细的解析。',
    date: '2024-03-08',
    author: '教研组'
  },
  {
    id: 'language-tutor',
    name: '语言导师',
    description: '提供外语学习辅导，包括语法纠错、口语练习和写作润色。',
    icon: Languages,
    skills: ['语法检查', '多语言支持', '写作优化'],
    popular: false,
    color: 'from-cyan-500 to-sky-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30',
    prompt: '你是一位资深的语言导师。请帮助学生纠正语法错误，优化写作表达，并提供地道的口语练习建议。在指出错误时，请给出正确的用法和解释。',
    date: '2024-02-25',
    author: '语言组'
  },
];

interface AgentTemplatesProps {
  onSelectTemplate: (template: any) => void;
  onCreateFromScratch: () => void;
}

export function AgentTemplates({ onSelectTemplate, onCreateFromScratch }: AgentTemplatesProps) {
  // Sort templates by date descending
  const sortedTemplates = [...agentTemplates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex-1 overflow-y-auto bg-background/50 p-8 flex flex-col items-center">
      <div className="max-w-7xl w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              智能体模版
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              选择一个预设模版快速创建智能体，或从零开始定制您的 AI 助手。
            </p>
          </div>
          <Button 
            onClick={onCreateFromScratch} 
            size="lg" 
            className="shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all bg-gradient-to-r from-primary to-purple-600 border-0 h-12 px-6 rounded-full font-medium"
          >
            <Plus className="mr-2 h-5 w-5" />
            新建智能体
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
                onClick={() => onSelectTemplate(template)}
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

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-[10px] font-medium border border-border/50">
                        {skill}
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
                    <div className="flex items-center gap-1 text-xs font-medium">
                       <Calendar className="w-3 h-3" />
                       {template.date}
                    </div>
                  </div>
                </div>

                {/* Hover Action Overlay (Subtle) */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Button size="sm" className={`rounded-full shadow-lg bg-gradient-to-r ${template.color} border-0 hover:opacity-90`}>
                    使用模版 <ArrowRight className="ml-1 w-3 h-3" />
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
