import { X, Check } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'; // Assuming Select exists
import { Checkbox } from './ui/checkbox'; // Assuming Checkbox exists

interface PropertyPanelProps {
  node: any;
  onClose: () => void;
  onUpdate: (node: any) => void;
}

export function PropertyPanel({ node, onClose, onUpdate }: PropertyPanelProps) {
  const [gradingRules, setGradingRules] = useState('');
  const [keyPoints, setKeyPoints] = useState('');

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
              <Label htmlFor="key-points">黄金结构</Label>
              <Textarea
                id="key-points"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="定义答题的关键得分点..."
                className="h-32"
              />
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
