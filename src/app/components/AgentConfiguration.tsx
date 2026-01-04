import { useState, useEffect } from 'react';
import { Bot, Settings, Play, Save, Code, MessageSquare, Wrench, User, Plus, ArrowLeft, Share2, Copy, Check, Rocket } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface AgentConfigurationProps {
  initialData?: any;
  onBack?: () => void;
}

export function AgentConfiguration({ initialData, onBack }: AgentConfigurationProps) {
  const [agentName, setAgentName] = useState('未命名智能体');
  const [agentDescription, setAgentDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [previewMessages, setPreviewMessages] = useState<{role: 'user' | 'assistant' | 'system', content: string}[]>([
    { role: 'assistant', content: '你好！我是你配置的智能体。请问有什么可以帮你的？' }
  ]);
  const [previewInput, setPreviewInput] = useState('');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishLink, setPublishLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Track prompt changes to show notification
  useEffect(() => {
    if (prompt && initialData && prompt !== initialData.prompt) {
       // Debounce or just show on blur? For simplicity, we can show it when user stops typing for a bit or on blur.
       // Here we'll rely on the textarea's onBlur event to trigger a "system" message in the preview.
    }
  }, [prompt]);

  const handlePromptBlur = () => {
      setPreviewMessages(prev => [...prev, { role: 'system', content: '系统：配置已更新，智能体将应用新的人设与逻辑。' }]);
  };

  useEffect(() => {
    if (initialData) {
      setAgentName(initialData.name || '未命名智能体');
      setAgentDescription(initialData.description || '');
      setPrompt(initialData.prompt || '');
    }
  }, [initialData]);

  const handleSendPreview = () => {
    if (!previewInput.trim()) return;
    setPreviewMessages(prev => [...prev, { role: 'user', content: previewInput }]);
    setPreviewInput('');
    // Simulate response
    setTimeout(() => {
      setPreviewMessages(prev => [...prev, { role: 'assistant', content: '这是一个预览回复。实际回复将根据你的提示词和插件配置生成。' }]);
    }, 1000);
  };

  const handlePublish = () => {
    // Simulate link generation
    const link = `https://edusaas.com/agent/${Math.random().toString(36).substr(2, 9)}`;
    setPublishLink(link);
    setShowPublishDialog(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publishLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-secondary/30">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <input 
              value={agentName} 
              onChange={(e) => setAgentName(e.target.value)}
              className="bg-transparent font-semibold text-lg focus:outline-none focus:border-b border-primary/50 w-full"
            />
            <p className="text-xs text-muted-foreground">智能体配置</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" />
            保存草稿
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={handlePublish}>
            <Rocket className="w-4 h-4" />
            发布
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Persona & Prompt */}
        <div className="w-1/3 border-r border-border flex flex-col bg-background/50">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-purple-500" />
                  人设与回复逻辑
                </h3>
                <Textarea 
                  placeholder="设定智能体的人设、语气和回复逻辑..." 
                  className="min-h-[300px] resize-none font-mono text-sm"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onBlur={handlePromptBlur}
                />
                <p className="text-xs text-muted-foreground">
                  提示：清晰地描述智能体的角色、目标和限制条件。
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  开场白
                </h3>
                <Textarea 
                  placeholder="设置智能体的第一句问候语..." 
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Middle Column: Skills & Tools */}
        <div className="w-1/3 border-r border-border flex flex-col bg-background/30">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-orange-500" />
                    智能体能力 (插件)
                  </h3>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  让智能体拥有联网搜索、画图等额外能力。
                </p>
                
                <Card className="border-dashed border-2 shadow-none bg-transparent hover:bg-accent/50 cursor-pointer transition-colors">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-muted-foreground py-8">
                    <Code className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">添加能力</span>
                  </CardContent>
                </Card>

                {/* Example Active Plugin */}
                <Card className="relative group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <SearchIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">联网搜索</h4>
                      <p className="text-xs text-muted-foreground">Google Search API</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">已启用</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <DatabaseIcon className="w-4 h-4 text-green-500" />
                    学习资料 (知识库)
                  </h3>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  上传课本或教案，让智能体基于这些内容回答。
                </p>
                <div className="text-center p-8 border border-border rounded-lg bg-background/50">
                  <p className="text-sm text-muted-foreground">暂无关联资料</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Preview */}
        <div className="w-1/3 flex flex-col bg-background">
          <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/20">
            <span className="text-sm font-medium text-muted-foreground">预览与调试</span>
            <Button variant="ghost" size="sm" className="text-xs h-7">重置</Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {previewMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={msg.role === 'assistant' ? 'bg-purple-600 text-white' : 'bg-muted'}>
                      {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`p-3 rounded-lg max-w-[85%] text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted text-foreground rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="relative">
              <Input 
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPreview()}
                placeholder="在此输入以测试智能体..."
                className="pr-10"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1 h-8 w-8 text-primary hover:text-primary/80"
                onClick={handleSendPreview}
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发布成功！</DialogTitle>
            <DialogDescription>
              您的智能体已成功发布。学生现在可以通过以下链接直接访问。
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 p-2 bg-muted rounded border text-sm text-muted-foreground truncate">
              {publishLink}
            </div>
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPublishDialog(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Icons
function UserIcon(props: any) { return <User {...props} /> }
function PlusIcon(props: any) { return <Plus {...props} /> }
function SearchIcon(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div> }
function DatabaseIcon(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div> }
function SendIcon(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></div> }
