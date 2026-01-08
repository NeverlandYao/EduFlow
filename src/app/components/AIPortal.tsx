import { useState } from 'react';
import { Send, Bot, User, Sparkles, Paperclip, Mic, Image as ImageIcon, MessageSquarePlus, History, Settings, MoreHorizontal, Trash2, GraduationCap, Code, Languages, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';

// Import or mock agent templates
const agentTemplates = [
  {
    id: 'teaching-assistant',
    name: '全能助教',
    description: '辅助备课、答疑',
    icon: GraduationCap,
    color: 'from-indigo-500 to-violet-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30'
  },
  {
    id: 'exam-helper',
    name: '出题专家',
    description: '自动生成试题',
    icon: Code,
    color: 'from-pink-500 to-rose-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30'
  },
  {
    id: 'language-tutor',
    name: '语言导师',
    description: '外语学习辅导',
    icon: Languages,
    color: 'from-cyan-500 to-sky-500',
    iconColor: 'text-white',
    bgGradient: 'bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30'
  },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIPortal() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的教育 AI 助手。我可以帮您制定教案、分析学情、生成试题，或者回答任何教学相关的问题。请问今天有什么可以帮您？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSession, setActiveSession] = useState('current');
  const [activeAgent, setActiveAgent] = useState('teaching-assistant');
  const [sidebarTab, setSidebarTab] = useState('agents');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是一个模拟的 AI 回复。在实际系统中，这里将连接到后端 API 并流式传输 AI 的回答。我可以根据您选择的模型 (' + selectedModel + ') 来提供不同的回答风格和能力。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentAgent = agentTemplates.find(a => a.id === activeAgent) || agentTemplates[0];

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-secondary/30">
      {/* Secondary Sidebar */}
      <div className="w-72 bg-background border-r border-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
           <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="agents">智能体</TabsTrigger>
              <TabsTrigger value="history">历史对话</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1">
          {sidebarTab === 'agents' ? (
            <div className="p-3 space-y-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">可用智能体</div>
              {agentTemplates.map((agent) => {
                const Icon = agent.icon;
                const isActive = activeAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 ${
                      isActive 
                        ? 'bg-primary/5 border-primary/20 shadow-sm' 
                        : 'bg-card border-border/50 hover:bg-accent hover:border-border'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${agent.bgGradient} ${agent.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {agent.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {agent.description}
                      </div>
                    </div>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 space-y-1">
              <Button className="w-full justify-start gap-2 mb-4 shadow-sm" variant="outline">
                <MessageSquarePlus className="w-4 h-4" />
                新对话
              </Button>
              <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">今天</div>
              <Button 
                variant={activeSession === 'current' ? "secondary" : "ghost"} 
                className="w-full justify-start text-sm font-normal truncate h-9 px-2.5"
                onClick={() => setActiveSession('current')}
              >
                <span className="truncate">如何制定初中数学教案</span>
              </Button>
              {/* ... other history items ... */}
              <div className="px-2 py-2 mt-4 text-xs font-semibold text-muted-foreground">过去 7 天</div>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal truncate h-9 px-2.5">
                <span className="truncate">学生成绩波动分析报告</span>
              </Button>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" />
            助手设置
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative bg-secondary/30">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${currentAgent.color}`}>
              <currentAgent.icon className={`w-5 h-5 ${currentAgent.iconColor}`} />
            </div>
            <div>
              <h1 className="font-semibold text-lg flex items-center gap-2">
                {currentAgent.name}
                <Badge variant="outline" className="text-xs font-normal bg-background/50">AI 助手</Badge>
              </h1>
            </div>
          </div>
          
          <div className="w-64">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-background/50 backdrop-blur-sm border-primary/20 focus:ring-primary/20">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4 Turbo (增强版)</SelectItem>
                <SelectItem value="claude-3">Claude 3 Opus (推理版)</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro (快速版)</SelectItem>
                <SelectItem value="edu-special">Edu-Specialist (教育专有)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className={`w-8 h-8 md:w-10 md:h-10 border ${message.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {message.role === 'assistant' ? (
                  <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                ) : (
                  <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                )}
              </Avatar>
              
              <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-baseline gap-2 mb-1 px-1`}>
                  <span className="text-xs font-medium text-muted-foreground">
                    {message.role === 'assistant' ? 'AI 助手' : '我'}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Card className={`p-4 shadow-sm border-0 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-card text-card-foreground rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                    {message.content}
                  </p>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 text-purple-600 border border-purple-100">
                <AvatarFallback><Sparkles className="w-5 h-5" /></AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 h-10 px-4 bg-card rounded-2xl rounded-tl-none border shadow-sm">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-2 bottom-2.5 flex gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
              <ImageIcon className="w-5 h-5" />
            </Button>
          </div>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题，Shift + Enter 换行..."
            className="pl-24 pr-14 py-6 text-base rounded-full shadow-lg border-primary/10 focus-visible:ring-primary/20 bg-background"
          />
          
          <div className="absolute right-2 bottom-1.5 flex gap-1">
             {inputValue.trim() ? (
               <Button onClick={handleSendMessage} size="icon" className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-all">
                 <Send className="w-4 h-4" />
               </Button>
             ) : (
               <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                 <Mic className="w-5 h-5" />
               </Button>
             )}
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">AI 可能生成不准确的信息，请核对重要事实。</p>
        </div>
      </div>
      </div>
    </div>
  );
}
