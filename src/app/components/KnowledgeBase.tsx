import { useState } from 'react';
import { Brain, Database, FileText, Tags, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { KnowledgeLibrary } from './KnowledgeLibrary';
import { AnswerManager } from './AnswerManager';
import { RuleManager } from './RuleManager';
import { KnowledgeTagManager } from './KnowledgeTagManager';
import { RecycleBin } from './RecycleBin';

export function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: '知识库管理', icon: Brain },
    { id: 'answers', label: '标准答案库', icon: FileText },
    { id: 'rules', label: '校验规则配置', icon: Database },
    { id: 'knowledge', label: '知识点体系', icon: Tags },
    { id: 'trash', label: '回收站', icon: Trash2, separator: true }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <KnowledgeLibrary />;
      case 'answers':
        return <AnswerManager />;
      case 'rules':
        return <RuleManager />;
      case 'knowledge':
        return <KnowledgeTagManager />;
      case 'trash':
        return <RecycleBin />;
      default:
        return <KnowledgeLibrary />;
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            知识库中心
          </h2>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id}>
                  {item.separator && <Separator className="my-2" />}
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start gap-3 ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground">
            <div className="mb-2 font-medium text-foreground">当前统计</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>知识点</span>
                <span className="font-medium">248</span>
              </div>
              <div className="flex justify-between">
                <span>标准答案</span>
                <span className="font-medium">86</span>
              </div>
              <div className="flex justify-between">
                <span>校验规则</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
}
