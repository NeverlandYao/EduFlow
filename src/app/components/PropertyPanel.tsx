import { X, Check, Eye } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'; // Assuming Select exists
import { Checkbox } from './ui/checkbox'; // Assuming Checkbox exists
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PropertyPanelProps {
  node: any;
  onClose: () => void;
  onUpdate: (node: any) => void;
  onPreviewReport?: () => void;
}

export function PropertyPanel({ node, onClose, onUpdate, onPreviewReport }: PropertyPanelProps) {
  const [gradingRules, setGradingRules] = useState('');
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('none');

  const knowledgeBases = [
    { id: 'none', name: '不使用知识库' },
    { id: 'math-high-1', name: '高中数学必修一知识库' },
    { id: 'math-high-2', name: '高中数学必修二知识库' },
    { id: 'physics-1', name: '高中物理力学知识库' },
    { id: 'chemistry-1', name: '高中化学有机物知识库' },
  ];

  return (
    <div className="h-full flex flex-col bg-background animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="font-semibold text-lg">节点配置</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="node-name">节点名称</Label>
          <Input
            id="node-name"
            value={node.label}
            onChange={(e) => onUpdate({ ...node, label: e.target.value })}
            placeholder="输入节点名称"
          />
        </div>

        <div className="space-y-2">
          <Label>节点类型</Label>
          <div className="px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground font-medium border border-border">
            {node.type}
          </div>
        </div>

        {node.type === 'ai-grading' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="grading-rules">批改规则</Label>
              <Textarea
                id="grading-rules"
                value={gradingRules}
                onChange={(e) => setGradingRules(e.target.value)}
                placeholder="输入批改的标准和规则..."
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge-base">关联知识库</Label>
              <Select value={selectedKnowledgeBase} onValueChange={setSelectedKnowledgeBase}>
                <SelectTrigger id="knowledge-base">
                  <SelectValue placeholder="选择知识库" />
                </SelectTrigger>
                <SelectContent>
                  {knowledgeBases.map((kb) => (
                    <SelectItem key={kb.id} value={kb.id}>{kb.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                选择知识库后，AI 将基于库内知识进行更精准的批改。
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-link" />
                <Label htmlFor="auto-link" className="font-normal">自动关联知识点</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="highlight-weakness" />
                <Label htmlFor="highlight-weakness" className="font-normal">高亮薄弱环节</Label>
              </div>
            </div>
          </>
        )}

        {node.type === 'upload' && (
          <div className="space-y-2">
            <Label>上传方式</Label>
            <Select defaultValue="student">
              <SelectTrigger>
                <SelectValue placeholder="选择上传方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">学生端上传</SelectItem>
                <SelectItem value="batch">批量导入</SelectItem>
                <SelectItem value="scanner">扫描仪直传</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {node.type === 'export' && (
          <div className="space-y-4">
             <div className="space-y-2">
              <Label>报告包含内容</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="score-stats" defaultChecked />
                  <Label htmlFor="score-stats" className="font-normal">分数统计</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="knowledge-mastery" defaultChecked />
                  <Label htmlFor="knowledge-mastery" className="font-normal">知识点掌握率</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="error-analysis" defaultChecked />
                  <Label htmlFor="error-analysis" className="font-normal">错题分析</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <Checkbox id="student-ranking" />
                  <Label htmlFor="student-ranking" className="font-normal">学生排名</Label>
                </div>
              </div>
            </div>

            <Button 
               variant="outline" 
               className="w-full gap-2 mt-4" 
               onClick={onPreviewReport}
               disabled={node.status !== 'success'}
             >
               <Eye className="w-4 h-4" />
               预览报告样式
             </Button>
             {node.status !== 'success' && (
               <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                 请先运行工作流以生成报告
               </p>
             )}
           </div>
         )}
      </div>

      <div className="p-6 border-t border-border bg-muted/20">
        <Button 
          className="w-full gap-2" 
          onClick={() => {
            onUpdate({ ...node, configured: true });
            onClose();
          }}
        >
          <Check className="w-4 h-4" />
          确认配置
        </Button>
      </div>
    </div>
  );
}
