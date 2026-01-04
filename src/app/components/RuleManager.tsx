import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit, Trash, Save } from 'lucide-react';
import { Badge } from './ui/badge';

interface Rule {
  id: string;
  name: string;
  description: string;
  ruleType: 'length' | 'keyword' | 'structure' | 'logic';
  parameters: {
    minLength?: number;
    maxLength?: number;
    requiredKeywords?: string[];
    mustInclude?: string[];
  };
  severity: 'error' | 'warning' | 'info';
}

export function RuleManager() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: '答案长度检查',
      description: '检查学生答案的字数是否符合要求',
      ruleType: 'length',
      parameters: {
        minLength: 50,
        maxLength: 500
      },
      severity: 'warning'
    },
    {
      id: '2',
      name: '关键概念检查',
      description: '检查答案中是否包含必要的关键概念',
      ruleType: 'keyword',
      parameters: {
        requiredKeywords: ['构造主义', '学习者']
      },
      severity: 'error'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState<Partial<Rule>>({
    name: '',
    description: '',
    ruleType: 'length',
    parameters: {},
    severity: 'warning'
  });
  const [keywordInput, setKeywordInput] = useState('');

  const handleSave = () => {
    if (currentRule.id) {
      setRules(rules.map(r => r.id === currentRule.id ? currentRule as Rule : r));
    } else {
      const newRule: Rule = {
        id: Date.now().toString(),
        name: currentRule.name || '',
        description: currentRule.description || '',
        ruleType: currentRule.ruleType || 'length',
        parameters: currentRule.parameters || {},
        severity: currentRule.severity || 'warning'
      };
      setRules([...rules, newRule]);
    }
    handleCancel();
  };

  const handleEdit = (rule: Rule) => {
    setCurrentRule(rule);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleCancel = () => {
    setCurrentRule({
      name: '',
      description: '',
      ruleType: 'length',
      parameters: {},
      severity: 'warning'
    });
    setKeywordInput('');
    setIsEditing(false);
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setCurrentRule({
        ...currentRule,
        parameters: {
          ...currentRule.parameters,
          requiredKeywords: [
            ...(currentRule.parameters?.requiredKeywords || []),
            keywordInput.trim()
          ]
        }
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    const keywords = currentRule.parameters?.requiredKeywords || [];
    setCurrentRule({
      ...currentRule,
      parameters: {
        ...currentRule.parameters,
        requiredKeywords: keywords.filter((_, i) => i !== index)
      }
    });
  };

  const getRuleTypeLabel = (type: string) => {
    const labels = {
      length: '长度校验',
      keyword: '关键词校验',
      structure: '结构校验',
      logic: '逻辑校验'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      error: 'destructive',
      warning: 'default',
      info: 'secondary'
    };
    const labels = {
      error: '严重',
      warning: '警告',
      info: '提示'
    };
    return (
      <Badge variant={variants[severity as keyof typeof variants] as any}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>校验规则配置</h2>
          <p className="text-muted-foreground">设置答案批改的自动校验规则</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加校验规则
          </Button>
        )}
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{currentRule.id ? '编辑校验规则' : '新建校验规则'}</CardTitle>
            <CardDescription>配置自动化的答案校验逻辑</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ruleName">规则名称</Label>
                <Input
                  id="ruleName"
                  value={currentRule.name || ''}
                  onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                  placeholder="例如：答案长度检查"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ruleType">规则类型</Label>
                <Select
                  value={currentRule.ruleType}
                  onValueChange={(value) => setCurrentRule({ ...currentRule, ruleType: value as any })}
                >
                  <SelectTrigger id="ruleType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="length">长度校验</SelectItem>
                    <SelectItem value="keyword">关键词校验</SelectItem>
                    <SelectItem value="structure">结构校验</SelectItem>
                    <SelectItem value="logic">逻辑校验</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">规则描述</Label>
              <Textarea
                id="description"
                value={currentRule.description || ''}
                onChange={(e) => setCurrentRule({ ...currentRule, description: e.target.value })}
                placeholder="描述这条规则的作用"
                rows={2}
              />
            </div>

            {currentRule.ruleType === 'length' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength">最小字数</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={currentRule.parameters?.minLength || ''}
                    onChange={(e) => setCurrentRule({
                      ...currentRule,
                      parameters: { ...currentRule.parameters, minLength: parseInt(e.target.value) }
                    })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLength">最大字数</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={currentRule.parameters?.maxLength || ''}
                    onChange={(e) => setCurrentRule({
                      ...currentRule,
                      parameters: { ...currentRule.parameters, maxLength: parseInt(e.target.value) }
                    })}
                    placeholder="1000"
                  />
                </div>
              </div>
            )}

            {currentRule.ruleType === 'keyword' && (
              <div className="space-y-2">
                <Label htmlFor="keywords">必需关键词</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="输入关键词"
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  />
                  <Button type="button" variant="outline" onClick={addKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(currentRule.parameters?.requiredKeywords || []).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="severity">严重程度</Label>
              <Select
                value={currentRule.severity}
                onValueChange={(value) => setCurrentRule({ ...currentRule, severity: value as any })}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">严重 - 必须修正</SelectItem>
                  <SelectItem value="warning">警告 - 建议修正</SelectItem>
                  <SelectItem value="info">提示 - 参考信息</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <Badge variant="outline">{getRuleTypeLabel(rule.ruleType)}</Badge>
                    {getSeverityBadge(rule.severity)}
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rule.ruleType === 'length' && (
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      最小字数: <span className="font-medium text-foreground">{rule.parameters.minLength || '不限'}</span>
                    </span>
                    <span className="text-muted-foreground">
                      最大字数: <span className="font-medium text-foreground">{rule.parameters.maxLength || '不限'}</span>
                    </span>
                  </div>
                )}
                {rule.ruleType === 'keyword' && rule.parameters.requiredKeywords && (
                  <div className="flex flex-wrap gap-2">
                    {rule.parameters.requiredKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
