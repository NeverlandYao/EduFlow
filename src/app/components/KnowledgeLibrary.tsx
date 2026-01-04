import { useState } from 'react';
import { Plus, Upload, Search, Edit, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface KnowledgeItem {
  id: string;
  name: string;
  tags: string[];
  subject: string;
  grade: string;
  relatedTopics: string[];
  updateTime: string;
  status: 'published' | 'draft' | 'reviewing';
}

export function KnowledgeLibrary() {
  const [selectedSubject, setSelectedSubject] = useState('全部');
  const [selectedGrade, setSelectedGrade] = useState('全部年级');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部难度');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = ['全部', '语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '001',
      name: '一元二次方程概述',
      tags: ['方程求解', '因式分解', '公式法', '图像分析'],
      subject: '数学',
      grade: '初中三年级',
      relatedTopics: ['方程', '代数'],
      updateTime: '2025-12-20',
      status: 'published'
    },
    {
      id: '002',
      name: '文言文断句技巧',
      tags: ['断句规则', '虚词分析', '语意理解', '正确标点运用'],
      subject: '语文',
      grade: '高中一年级',
      relatedTopics: ['文言文', '阅读理解'],
      updateTime: '2025-12-18',
      status: 'published'
    },
    {
      id: '003',
      name: '一般过去时的用法',
      tags: ['语法规则', '时态运用', '不规则动词变化', '时间状语标志'],
      subject: '英语',
      grade: '小学六年级',
      relatedTopics: ['时态', '语法'],
      updateTime: '2025-12-15',
      status: 'reviewing'
    },
    {
      id: '004',
      name: '牛顿第一定律',
      tags: ['惯性', '力与运动', '实验验证'],
      subject: '物理',
      grade: '初中二年级',
      relatedTopics: ['力学', '经典物理'],
      updateTime: '2025-12-10',
      status: 'published'
    },
    {
      id: '005',
      name: '光合作用原理',
      tags: ['叶绿体', '光反应', '暗反应', '能量转换'],
      subject: '生物',
      grade: '高中一年级',
      relatedTopics: ['植物生理', '细胞代谢'],
      updateTime: '2025-12-08',
      status: 'draft'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: '已发布', variant: 'default' as const },
      draft: { label: '草稿', variant: 'secondary' as const },
      reviewing: { label: '审核中', variant: 'outline' as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchSubject = selectedSubject === '全部' || item.subject === selectedSubject;
    const matchGrade = selectedGrade === '全部年级' || item.grade === selectedGrade;
    const matchSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchSubject && matchGrade && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>知识库管理</h2>
          <p className="text-muted-foreground">管理学科知识点体系和教学内容</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            批量导入
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            新建知识库
          </Button>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subjects.map((subject) => (
          <Button
            key={subject}
            variant={selectedSubject === subject ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSubject(subject)}
            className="whitespace-nowrap"
          >
            {subject}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索知识点/标签/学科"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部年级">全部年级</SelectItem>
            <SelectItem value="小学一年级">小学一年级</SelectItem>
            <SelectItem value="小学二年级">小学二年级</SelectItem>
            <SelectItem value="小学三年级">小学三年级</SelectItem>
            <SelectItem value="小学四年级">小学四年级</SelectItem>
            <SelectItem value="小学五年级">小学五年级</SelectItem>
            <SelectItem value="小学六年级">小学六年级</SelectItem>
            <SelectItem value="初中一年级">初中一年级</SelectItem>
            <SelectItem value="初中二年级">初中二年级</SelectItem>
            <SelectItem value="初中三年级">初中三年级</SelectItem>
            <SelectItem value="高中一年级">高中一年级</SelectItem>
            <SelectItem value="高中二年级">高中二年级</SelectItem>
            <SelectItem value="高中三年级">高中三年级</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部难度">全部难度</SelectItem>
            <SelectItem value="基础">基础</SelectItem>
            <SelectItem value="进阶">进阶</SelectItem>
            <SelectItem value="高级">高级</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>知识点名称</TableHead>
              <TableHead>科目</TableHead>
              <TableHead>年级</TableHead>
              <TableHead>关联题型</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium mb-1">{item.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="text-xs text-muted-foreground">
                          {tag}
                          {index < item.tags.length - 1 ? '、' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.grade}</TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell>{item.updateTime}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          显示 1-{filteredItems.length} 条，共 {filteredItems.length} 条
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            下一页
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">知识库总量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold">248</div>
              <Badge variant="secondary" className="gap-1">
                <span className="text-green-600">↑ 12% 较上月</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">校验规则数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold">86</div>
              <Badge variant="secondary" className="gap-1">
                <span className="text-green-600">↑ 6% 较上月</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">知识点标签数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold">156</div>
              <Badge variant="secondary" className="gap-1">
                <span className="text-green-600">↑ 8% 较上月</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
