import { Bot, GraduationCap, Languages, Calculator, Code, Plus, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const agentTemplates = [
  {
    id: 'teaching-assistant',
    name: '全能助教',
    description: '辅助教师进行备课、答疑、作业设计等多场景任务。',
    icon: GraduationCap,
    skills: ['教案生成', '多轮对话', '知识库问答'],
    popular: true,
    color: 'bg-indigo-500/10 text-indigo-600',
    prompt: '你是一位经验丰富的全能助教。你的任务是辅助教师完成日常教学工作，包括但不限于备课建议、学生答疑、作业设计和试题生成。请保持专业、耐心且富有教育意义的语气。',
    date: '2024-03-12',
  },
  {
    id: 'exam-helper',
    name: '出题专家',
    description: '根据指定知识点和难度，自动生成高质量试题和解析。',
    icon: Code,
    skills: ['试题生成', '答案解析', '难度分级'],
    popular: true,
    color: 'bg-pink-500/10 text-pink-600',
    prompt: '你是一位专业的出题专家。请根据用户提供的知识点、题型和难度要求，生成结构严谨、逻辑清晰的试题。每道题都应包含标准答案和详细的解析。',
    date: '2024-03-08',
  },
  {
    id: 'language-tutor',
    name: '语言导师',
    description: '提供外语学习辅导，包括语法纠错、口语练习和写作润色。',
    icon: Languages,
    skills: ['语法检查', '多语言支持', '写作优化'],
    popular: false,
    color: 'bg-cyan-500/10 text-cyan-600',
    prompt: '你是一位资深的语言导师。请帮助学生纠正语法错误，优化写作表达，并提供地道的口语练习建议。在指出错误时，请给出正确的用法和解释。',
    date: '2024-02-25',
  },
  {
    id: 'math-solver',
    name: '理科解题王',
    description: '专注于数理化难题的步骤拆解和原理讲解。',
    icon: Calculator,
    skills: ['步骤拆解', '公式识别', '原理讲解'],
    popular: false,
    color: 'bg-amber-500/10 text-amber-600',
    prompt: '你是一位理科解题高手。面对复杂的数理化题目，请一步步拆解解题过程，清晰地展示公式推导和计算逻辑，并解释背后的科学原理。',
    date: '2024-02-15',
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
    <div className="flex-1 overflow-y-auto bg-secondary/30 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">智能体模版</h1>
            <p className="text-muted-foreground mt-1">
              选择一个预设模版快速创建智能体，或从零开始定制
            </p>
          </div>
          <Button 
            onClick={onCreateFromScratch} 
            size="lg" 
            className="shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" />
            新建智能体
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
                onClick={() => onSelectTemplate(template)}
              >
                {template.popular && (
                  <div className="absolute top-0 right-0 p-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 gap-1">
                      <Sparkles className="h-3 w-3" />
                      热门
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
                  <div className="flex flex-wrap gap-2 mb-2">
                    {template.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-background/50 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                     <Calendar className="w-3 h-3" />
                     {template.date}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 mt-auto">
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    使用此模版
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
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">新建智能体</h3>
              <p className="text-muted-foreground text-sm mt-1">从空白开始配置</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
