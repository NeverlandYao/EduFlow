import { Layers, Database, ChartBar, User, Sparkles, Bell, Search, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface TopNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function TopNav({ activeView, onViewChange }: TopNavProps) {
  const navItems = [
    { id: 'workbench', icon: Layers, label: '工作台' },
    { id: 'portal', icon: Sparkles, label: 'AI 助手' }, // Changed to AI Assistant
    { id: 'knowledge', icon: Database, label: '知识库' },
    { id: 'data', icon: ChartBar, label: '数据中心' },
  ];

  return (
    <div className="h-16 w-full bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left: Logo & Nav */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block text-foreground">EduFlow 智教云</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`
                  relative gap-2 h-9 px-4 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-primary rounded-t-full" />
                )}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Hidden on small screens) */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="搜索..." 
            className="pl-9 h-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-full text-sm" 
          />
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>通知</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>设置</TooltipContent>
          </Tooltip>
          
          <Tooltip>
             <TooltipTrigger asChild>
              <div 
                className="flex items-center gap-3 pl-2 cursor-pointer group"
                onClick={() => onViewChange('profile')}
              >
                <Avatar className="w-9 h-9 border-2 border-background shadow-sm group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>个人中心</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
