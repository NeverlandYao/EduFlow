import { useState } from 'react';
import { FileText, Upload, Search, Tag, Save, Folder, Trash2, Clock, Star, MoreVertical, Plus, Filter, Workflow, Bot, BookOpen, FileQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const documents = [
  { id: 1, name: '高一数学-第一章作业.pdf', date: '2025-12-15', status: 'processed', size: '2.4 MB', type: 'PDF', category: 'workflow' },
  { id: 2, name: '函数知识点总结.docx', date: '2025-12-14', status: 'processed', size: '1.8 MB', type: 'DOCX', category: 'ai' },
  { id: 3, name: '期末考试试卷.pdf', date: '2025-12-10', status: 'processing', size: '4.5 MB', type: 'PDF', category: 'workflow' },
  { id: 4, name: '错题集-三角函数.pdf', date: '2025-12-08', status: 'processed', size: '3.2 MB', type: 'PDF', category: 'ai' },
  { id: 5, name: '导数习题集.pdf', date: '2025-12-05', status: 'processed', size: '5.1 MB', type: 'PDF', category: 'resources' },
];

const knowledgeTags = [
  '函数基础', '导数应用', '三角恒等变换', '解析几何', '立体几何', 
  '数列求和', '概率统计', '不等式', '向量运算'
];

const categories = [
  { id: 'all', label: '全部文件', icon: Folder, description: '所有已上传文件' },
  { id: 'workflow', label: '工作流资料', icon: Workflow, description: '用于作业批改、试卷分析' },
  { id: 'ai', label: 'AI 知识库', icon: Bot, description: '用于教案生成、智能问答' },
  { id: 'resources', label: '教学资源', icon: BookOpen, description: '课件、习题等通用资源' },
  { id: 'trash', label: '回收站', icon: Trash2, description: '已删除的文件' },
];

export function KnowledgeBase() {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc => {
    if (activeCategory !== 'all' && activeCategory !== 'trash' && doc.category !== activeCategory) return false;
    // Simple mock filter for trash (assuming no docs are actually trash in this mock)
    if (activeCategory === 'trash') return false; 
    
    if (searchQuery) {
      return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-secondary/30">
      {/* Secondary Sidebar - Navigation */}
      <div className="w-64 bg-background border-r border-border flex flex-col hidden md:flex">
        <div className="p-4">
          <Button className="w-full gap-2 shadow-sm">
            <Upload className="w-4 h-4" />
            上传文件
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3 font-normal h-auto py-3"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{category.label}</div>
                    {category.description && (
                      <div className="text-[10px] text-muted-foreground line-clamp-1 font-normal">
                        {category.description}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          <Separator className="my-4" />

          <div className="px-3 mb-2">
            <h3 className="text-xs font-medium text-muted-foreground">快速筛选</h3>
          </div>
          <div className="space-y-1">
            {knowledgeTags.slice(0, 5).map((tag) => (
              <Button key={tag} variant="ghost" className="w-full justify-start gap-3 font-normal h-8">
                <Tag className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{tag}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="搜索文件名、内容或标签..." 
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">共 {filteredDocs.length} 个文件</span>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocs.map((doc) => (
                <Card 
                  key={doc.id}
                  className={`
                    cursor-pointer transition-all hover:shadow-md border-2
                    ${selectedDoc?.id === doc.id ? 'border-primary ring-1 ring-primary/20' : 'border-transparent hover:border-border'}
                  `}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                        {doc.type === 'PDF' ? <FileText className="w-6 h-6" /> : <FileQuestion className="w-6 h-6" />}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <h3 className="font-medium text-sm mb-1 truncate" title={doc.name}>{doc.name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>{doc.date}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Badge variant={doc.status === 'processed' ? 'secondary' : 'outline'} className="text-[10px] h-5">
                        {doc.status === 'processed' ? '已处理' : '处理中'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] h-5 bg-muted/50 font-normal">
                        {categories.find(c => c.id === doc.category)?.label || '其他'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Upload Placeholder */}
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/50 transition-colors min-h-[160px]">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">上传新文件</span>
              </div>
            </div>
          </ScrollArea>

          {/* Details Panel (Right Sidebar) */}
          {selectedDoc && (
            <div className="w-80 bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-border">
                <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-center font-semibold text-lg break-words">{selectedDoc.name}</h2>
                <p className="text-center text-sm text-muted-foreground mt-1">{selectedDoc.size} • {selectedDoc.type}</p>
              </div>
              
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">文件用途</h3>
                    <Select defaultValue={selectedDoc.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择用途" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workflow">工作流资料</SelectItem>
                        <SelectItem value="ai">AI 知识库</SelectItem>
                        <SelectItem value="resources">教学资源</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedDoc.category === 'workflow' ? '此文件可被自动批改工作流引用作为参考答案或规则。' :
                       selectedDoc.category === 'ai' ? 'AI 助手将学习此文件内容以回答相关问题。' :
                       '通用资源，仅作存储和展示。'}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">文件信息</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">上传时间</span>
                        <span>{selectedDoc.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">状态</span>
                        <span className={selectedDoc.status === 'processed' ? 'text-green-600' : 'text-yellow-600'}>
                          {selectedDoc.status === 'processed' ? '已解析' : '解析中'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">关联标签</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">函数</Badge>
                      <Badge variant="secondary">高一数学</Badge>
                      <Button variant="outline" size="sm" className="h-5 text-xs px-2 border-dashed">
                        <Plus className="w-3 h-3 mr-1" />
                        添加
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">操作</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">预览</Button>
                      <Button variant="outline" size="sm">下载</Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">删除</Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
