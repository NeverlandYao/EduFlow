import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit, Trash, Save } from 'lucide-react';
import { Badge } from './ui/badge';
import { Combobox } from './ui/combobox';

interface KnowledgeTag {
  id: string;
  name: string;
  category: string;
  description: string;
  level: '基础' | '进阶' | '高级';
  parentId?: string;
  relatedTags: string[];
}

export function KnowledgeTagManager() {
  const [tags, setTags] = useState<KnowledgeTag[]>([
    {
      id: '1',
      name: '构造主义',
      category: '学习理论',
      description: '强调学习者主动建构知识的理论',
      level: '基础',
      relatedTags: ['建构主义', '认知发展']
    },
    {
      id: '2',
      name: '最近发展区',
      category: '认知发展',
      description: '维果茨基提出的概念，指学习者当前水平与潜在发展水平之间的区域',
      level: '进阶',
      relatedTags: ['维果茨基', '支架式教学']
    },
    {
      id: '3',
      name: '元认知',
      category: '认知心理',
      description: '对自己认知过程的认知和调控',
      level: '高级',
      relatedTags: ['自我调节学习', '反思性思维']
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState<Partial<KnowledgeTag>>({
    name: '',
    category: '',
    description: '',
    level: '基础',
    relatedTags: []
  });
  const [relatedTagInput, setRelatedTagInput] = useState('');

  const categories = Array.from(new Set(tags.map(t => t.category))).concat(['学习理论', '认知发展', '认知心理', '教学方法']);

  const handleSave = () => {
    if (currentTag.id) {
      setTags(tags.map(t => t.id === currentTag.id ? currentTag as KnowledgeTag : t));
    } else {
      const newTag: KnowledgeTag = {
        id: Date.now().toString(),
        name: currentTag.name || '',
        category: currentTag.category || '',
        description: currentTag.description || '',
        level: currentTag.level || '基础',
        relatedTags: currentTag.relatedTags || []
      };
      setTags([...tags, newTag]);
    }
    handleCancel();
  };

  const handleEdit = (tag: KnowledgeTag) => {
    setCurrentTag(tag);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const handleCancel = () => {
    setCurrentTag({
      name: '',
      category: '',
      description: '',
      level: '基础',
      relatedTags: []
    });
    setRelatedTagInput('');
    setIsEditing(false);
  };

  const addRelatedTag = () => {
    if (relatedTagInput.trim()) {
      setCurrentTag({
        ...currentTag,
        relatedTags: [...(currentTag.relatedTags || []), relatedTagInput.trim()]
      });
      setRelatedTagInput('');
    }
  };

  const removeRelatedTag = (index: number) => {
    setCurrentTag({
      ...currentTag,
      relatedTags: (currentTag.relatedTags || []).filter((_, i) => i !== index)
    });
  };

  const getLevelColor = (level: string) => {
    const colors = {
      '基础': 'default',
      '进阶': 'secondary',
      '高级': 'outline'
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, KnowledgeTag[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>知识点标签体系</h2>
          <p className="text-muted-foreground">构建学科知识图谱和标签分类</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加知识点标签
          </Button>
        )}
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{currentTag.id ? '编辑知识点标签' : '新建知识点标签'}</CardTitle>
            <CardDescription>定义知识点的属性和关联关系</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tagName">知识点名称</Label>
                <Input
                  id="tagName"
                  value={currentTag.name || ''}
                  onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
                  placeholder="例如：构造主义"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">所属分类</Label>
                <Combobox
                  value={currentTag.category || ''}
                  onValueChange={(value) => setCurrentTag({ ...currentTag, category: value })}
                  options={Array.from(new Set(categories))}
                  placeholder="选择或输入分类"
                  searchPlaceholder="搜索分类..."
                  emptyText="未找到分类"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagDescription">知识点描述</Label>
              <Textarea
                id="tagDescription"
                value={currentTag.description || ''}
                onChange={(e) => setCurrentTag({ ...currentTag, description: e.target.value })}
                placeholder="简要描述这个知识点的核心概念"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">难度等级</Label>
              <Select
                value={currentTag.level}
                onValueChange={(value) => setCurrentTag({ ...currentTag, level: value as any })}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="基础">基础</SelectItem>
                  <SelectItem value="进阶">进阶</SelectItem>
                  <SelectItem value="高级">高级</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relatedTags">关联标签</Label>
              <div className="flex gap-2">
                <Input
                  id="relatedTags"
                  value={relatedTagInput}
                  onChange={(e) => setRelatedTagInput(e.target.value)}
                  placeholder="输入相关联的知识点"
                  onKeyPress={(e) => e.key === 'Enter' && addRelatedTag()}
                />
                <Button type="button" variant="outline" onClick={addRelatedTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(currentTag.relatedTags || []).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      onClick={() => removeRelatedTag(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
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

      <div className="space-y-6">
        {Object.entries(groupedTags).map(([category, categoryTags]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-medium">{category}</h3>
            <div className="grid gap-4">
              {categoryTags.map((tag) => (
                <Card key={tag.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{tag.name}</CardTitle>
                          <Badge variant={getLevelColor(tag.level) as any}>
                            {tag.level}
                          </Badge>
                        </div>
                        <CardDescription>{tag.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)}>
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {tag.relatedTags.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">关联知识点：</span>
                        <div className="flex flex-wrap gap-2">
                          {tag.relatedTags.map((relatedTag, index) => (
                            <Badge key={index} variant="outline">
                              {relatedTag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
