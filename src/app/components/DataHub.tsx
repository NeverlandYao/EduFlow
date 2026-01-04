import { useState } from 'react';
import { 
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, Users, TriangleAlert, FileText, Settings, 
  Filter, Download, BookOpen, Target, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

// --- Mock Data ---

const assignmentList = [
  { id: 'hw1', name: '第一章：函数基础作业' },
  { id: 'hw2', name: '第二章：导数应用练习' },
  { id: 'exam1', name: '期中考试' },
  { id: 'hw3', name: '第三章：三角函数测验' },
];

const classList = [
  { id: 'c1', name: '高一(1)班' },
  { id: 'c2', name: '高一(2)班' },
  { id: 'c3', name: '高一(3)班' },
];

const subjectList = [
  { id: 'math', name: '数学' },
  { id: 'physics', name: '物理' },
  { id: 'chem', name: '化学' },
];

// Data Sets for different filters
const dataSets = {
  default: {
    metrics: {
      avgScore: 82.5,
      avgScoreGrowth: 5.2,
      masteryRate: 78,
      masteryGrowth: 3.4,
      studentCount: 15,
      submitRate: 100
    },
    knowledgeError: [
      { name: '复合函数求导', errorRate: 68, count: 45 },
      { name: '三角恒等变换', errorRate: 62, count: 38 },
      { name: '立体几何证明', errorRate: 55, count: 32 },
      { name: '数列求和', errorRate: 45, count: 28 },
      { name: '向量运算', errorRate: 38, count: 25 },
      { name: '概率计算', errorRate: 25, count: 15 },
      { name: '集合运算', errorRate: 12, count: 8 },
    ],
    trend: [
      { date: '9月', avgScore: 72, knowledgeMastery: 65 },
      { date: '10月', avgScore: 75, knowledgeMastery: 70 },
      { date: '11月', avgScore: 78, knowledgeMastery: 75 },
      { date: '12月', avgScore: 82, knowledgeMastery: 80 },
      { date: '1月', avgScore: 85, knowledgeMastery: 82 },
    ]
  },
  alt: {
    metrics: {
      avgScore: 76.8,
      avgScoreGrowth: 2.1,
      masteryRate: 72,
      masteryGrowth: 1.5,
      studentCount: 42,
      submitRate: 100
    },
    knowledgeError: [
      { name: '导数定义', errorRate: 58, count: 35 },
      { name: '极值点偏移', errorRate: 52, count: 30 },
      { name: '切线方程', errorRate: 45, count: 22 },
      { name: '单调性判断', errorRate: 35, count: 18 },
      { name: '零点问题', errorRate: 30, count: 15 },
    ],
    trend: [
      { date: '9月', avgScore: 70, knowledgeMastery: 62 },
      { date: '10月', avgScore: 72, knowledgeMastery: 66 },
      { date: '11月', avgScore: 74, knowledgeMastery: 69 },
      { date: '12月', avgScore: 76, knowledgeMastery: 72 },
      { date: '1月', avgScore: 77, knowledgeMastery: 73 },
    ]
  },
  physics: {
    metrics: {
      avgScore: 79.2,
      avgScoreGrowth: 4.5,
      masteryRate: 75,
      masteryGrowth: 2.8,
      studentCount: 45,
      submitRate: 98
    },
    knowledgeError: [
      { name: '牛顿第二定律', errorRate: 65, count: 42 },
      { name: '动能定理', errorRate: 58, count: 36 },
      { name: '万有引力', errorRate: 52, count: 30 },
      { name: '机械能守恒', errorRate: 48, count: 25 },
      { name: '电场强度', errorRate: 40, count: 20 },
    ],
    trend: [
      { date: '9月', avgScore: 71, knowledgeMastery: 64 },
      { date: '10月', avgScore: 73, knowledgeMastery: 68 },
      { date: '11月', avgScore: 76, knowledgeMastery: 71 },
      { date: '12月', avgScore: 78, knowledgeMastery: 74 },
      { date: '1月', avgScore: 79, knowledgeMastery: 75 },
    ]
  },
  chem: {
    metrics: {
      avgScore: 84.5,
      avgScoreGrowth: 6.2,
      masteryRate: 81,
      masteryGrowth: 4.1,
      studentCount: 45,
      submitRate: 100
    },
    knowledgeError: [
      { name: '氧化还原反应', errorRate: 55, count: 32 },
      { name: '离子方程式', errorRate: 48, count: 28 },
      { name: '化学平衡', errorRate: 42, count: 24 },
      { name: '电化学基础', errorRate: 35, count: 18 },
      { name: '有机合成', errorRate: 30, count: 15 },
    ],
    trend: [
      { date: '9月', avgScore: 75, knowledgeMastery: 68 },
      { date: '10月', avgScore: 78, knowledgeMastery: 72 },
      { date: '11月', avgScore: 81, knowledgeMastery: 76 },
      { date: '12月', avgScore: 83, knowledgeMastery: 79 },
      { date: '1月', avgScore: 85, knowledgeMastery: 81 },
    ]
  }
};

// Card 2: Student Cluster Data (Scatter Plot)
// x: Mastery Balance (0-100), y: Average Mastery Rate (0-100)
const studentClusterData = [
  { id: 1, name: '张三', x: 85, y: 92, score: 95, group: '学霸区' }, // High balance, High mastery
  { id: 2, name: '李四', x: 75, y: 88, score: 89, group: '学霸区' },
  { id: 3, name: '王五', x: 45, y: 85, score: 82, group: '偏科区' }, // Low balance, High mastery
  { id: 4, name: '赵六', x: 90, y: 65, score: 70, group: '潜力区' }, // High balance, Low mastery
  { id: 5, name: '钱七', x: 30, y: 45, score: 55, group: '待进区' }, // Low balance, Low mastery
  { id: 6, name: '孙八', x: 82, y: 95, score: 98, group: '学霸区' },
  { id: 7, name: '周九', x: 50, y: 78, score: 76, group: '偏科区' },
  { id: 8, name: '吴十', x: 88, y: 70, score: 72, group: '潜力区' },
  { id: 9, name: '郑十一', x: 40, y: 50, score: 58, group: '待进区' },
  { id: 10, name: '冯十二', x: 95, y: 98, score: 99, group: '学霸区' },
  { id: 11, name: '陈十三', x: 60, y: 60, score: 65, group: '潜力区' },
  { id: 12, name: '楚十四', x: 20, y: 80, score: 78, group: '偏科区' },
  { id: 13, name: '魏十五', x: 86, y: 90, score: 93, group: '学霸区' },
  { id: 14, name: '蒋十六', x: 70, y: 85, score: 87, group: '学霸区' },
  { id: 15, name: '沈十七', x: 40, y: 82, score: 80, group: '偏科区' },
];

// Sort students by score high to low for the list
const sortedStudentList = [...studentClusterData].sort((a, b) => b.score - a.score);

// Student Detail Radar Data
const studentRadarData = [
  { subject: '函数', A: 120, fullMark: 150, classAvg: 105 },
  { subject: '导数', A: 98, fullMark: 150, classAvg: 95 },
  { subject: '几何', A: 86, fullMark: 150, classAvg: 100 },
  { subject: '三角', A: 99, fullMark: 150, classAvg: 90 },
  { subject: '数列', A: 85, fullMark: 150, classAvg: 88 },
  { subject: '概率', A: 65, fullMark: 150, classAvg: 80 },
];

const recentPractice = [
  { id: 1, name: '导数应用专项练习', date: '2025-12-20', score: 85, status: 'completed' },
  { id: 2, name: '立体几何每日一练', date: '2025-12-22', score: 60, status: 'completed' },
  { id: 3, name: '期末模拟卷一', date: '2025-12-24', score: 92, status: 'completed' },
];

export function DataHub() {
  // Filters State
  const [selectedAssignment, setSelectedAssignment] = useState('hw1');
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [appliedSubject, setAppliedSubject] = useState('math');
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentData, setCurrentData] = useState(dataSets.default);

  // Interaction State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [drillDownKnowledge, setDrillDownKnowledge] = useState<string | null>(null);

  const handleFilter = () => {
    // Update the applied subject when filter button is clicked
    setAppliedSubject(selectedSubject);

    // In a real app, this would fetch data based on filters.
    // For this mock, we just switch data sets if physics is selected as an example.
    if (selectedSubject === 'physics') {
      setCurrentData(dataSets.physics);
    } else if (selectedSubject === 'chem') {
      setCurrentData(dataSets.physics); // Reuse physics data for chem mock
    } else if (selectedClass === 'c2') {
      setCurrentData(dataSets.alt);
    } else {
      setCurrentData(dataSets.default);
    }
  };

  const handleBarClick = (data: any) => {
    setDrillDownKnowledge(data.name);
  };

  const handleScatterClick = (data: any) => {
    if (data && data.payload) {
      setCurrentStudent(data.payload);
      setStudentModalOpen(true);
    }
  };

  const handleStudentListClick = (student: any) => {
    setCurrentStudent(student);
    setStudentModalOpen(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          {payload.map((p: any, index: number) => (
            <p key={index} style={{ color: p.color }}>
              {p.name}: {p.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StudentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded shadow-sm text-xs">
          <p className="font-medium mb-1">{data.name}</p>
          <p>掌握率: {data.y}%</p>
          <p>均衡度: {data.x}%</p>
          <p>分数: {data.score}分</p>
          <p className="text-muted-foreground mt-1">{data.group}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full bg-secondary/30 overflow-hidden">
      {/* Left Filter Panel */}
      <aside className="w-64 bg-background border-r border-border flex flex-col p-4 space-y-6 h-full overflow-y-auto">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-1">
            <Settings className="h-5 w-5 text-primary" />
            数据配置
          </h2>
          <p className="text-xs text-muted-foreground">选择数据范围以查看分析</p>
        </div>

        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <label className="text-sm font-medium">作业/考试</label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="选择作业" />
              </SelectTrigger>
              <SelectContent>
                {assignmentList.map(item => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">班级</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="选择班级" />
              </SelectTrigger>
              <SelectContent>
                {classList.map(item => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">学科</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="选择学科" />
              </SelectTrigger>
              <SelectContent>
                {subjectList.map(item => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full gap-2 mt-4" onClick={handleFilter} disabled={isFiltering}>
            <Filter className="w-4 h-4" />
            {isFiltering ? '筛选中...' : '筛选'}
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium">分析目标</span>
          </div>
          <p className="text-[10px] text-blue-600 dark:text-blue-400">
            当前分析重点关注函数导数的综合应用能力，建议关注错题率超过50%的知识点。
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 shrink-0 px-6 pt-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              学情仪表盘
              <Badge variant="outline" className="text-lg font-normal px-3 py-1 bg-primary/5 border-primary/20 text-primary">
                {subjectList.find(s => s.id === appliedSubject)?.name || '数学'}
              </Badge>
            </h2>
            <p className="text-muted-foreground mt-1">
              实时监控班级学情数据，精准定位教学重难点
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setReportModalOpen(true)}>
            <FileText className="w-4 h-4" />
            生成分析报告
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto pb-6 space-y-6">
              
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Class Average */}
                <Card className="shadow-sm border-none bg-white/80 dark:bg-slate-950/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">班级平均分</h3>
                    <div className="text-5xl font-bold tracking-tight text-foreground mb-3">
                      {currentData.metrics.avgScore}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <div className="bg-green-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span>+{currentData.metrics.avgScoreGrowth}% 较上月</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Knowledge Mastery */}
                <Card className="shadow-sm border-none bg-white/80 dark:bg-slate-950/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">知识点掌握率</h3>
                    <div className="text-5xl font-bold tracking-tight text-foreground mb-3">
                      {currentData.metrics.masteryRate}%
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <div className="bg-green-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span>+{currentData.metrics.masteryGrowth}% 较上月</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: Student Participation */}
                <Card className="shadow-sm border-none bg-white/80 dark:bg-slate-950/80 backdrop-blur">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">参与学生数</h3>
                    <div className="text-5xl font-bold tracking-tight text-foreground mb-3">
                      {currentData.metrics.studentCount}<span className="text-2xl font-normal text-muted-foreground ml-1">人</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      <span>{currentData.metrics.submitRate}% 提交率</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1: Knowledge Point Error Rate */}
                <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TriangleAlert className="w-4 h-4 text-orange-500" />
                      班级知识点错误率柱状图
                    </CardTitle>
                    <CardDescription>点击柱条查看详细错题列表</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={currentData.knowledgeError}
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" unit="%" />
                          <YAxis type="category" dataKey="name" width={90} style={{ fontSize: '12px' }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border p-2 rounded text-xs shadow-lg">
                                    <p className="font-medium">{payload[0].payload.name}</p>
                                    <p className="text-red-500">错误率: {payload[0].value}%</p>
                                    <p className="text-muted-foreground">错题数: {payload[0].payload.count}题</p>
                                    <p className="text-xs text-blue-500 mt-1">点击查看详情 &gt;</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="errorRate" 
                            radius={[0, 4, 4, 0]} 
                            barSize={20}
                            onClick={handleBarClick}
                            className="cursor-pointer"
                          >
                            {currentData.knowledgeError.map((_, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index < 3 ? '#ef4444' : '#3b82f6'} 
                                fillOpacity={index < 3 ? 0.9 : 0.6}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Trend Analysis */}
                <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      趋势分析
                    </CardTitle>
                    <CardDescription>班级平均分与核心知识点掌握率变化趋势</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={currentData.trend}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line type="monotone" dataKey="avgScore" name="班级平均分" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="knowledgeMastery" name="核心知识点掌握率" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: Student Group Portrait */}
                <Card className="col-span-1 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      学生群体画像
                    </CardTitle>
                    <CardDescription>掌握度/均衡度分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[350px] gap-4">
                      {/* Left: Scatter Chart */}
                      <div className="flex-1 h-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 20, right: 10, bottom: 20, left: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="x" name="均衡度" unit="%" label={{ value: '均衡度', position: 'bottom', offset: 0, fontSize: 10 }} tick={{fontSize: 10}} />
                            <YAxis type="number" dataKey="y" name="掌握率" unit="%" label={{ value: '掌握率', angle: -90, position: 'left', fontSize: 10 }} tick={{fontSize: 10}} />
                            <Tooltip content={<StudentTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter 
                              name="Students" 
                              data={studentClusterData} 
                              onClick={handleScatterClick}
                              className="cursor-pointer"
                            >
                              {studentClusterData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={
                                  entry.group === '学霸区' ? '#22c55e' : 
                                  entry.group === '潜力区' ? '#3b82f6' : 
                                  entry.group === '偏科区' ? '#f59e0b' : '#ef4444'
                                } />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Right: Scrollable Student List */}
                      <div className="w-1/3 h-full border-l pl-4 flex flex-col overflow-hidden">
                        <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 shrink-0">
                           <div className="w-1 h-4 bg-primary rounded-full"></div>
                           学生分数排名
                        </div>
                        <div className="text-xs font-medium text-muted-foreground mb-2 flex justify-between items-center shrink-0">
                          <span>排名 (分)</span>
                          <span className="text-[10px]">点击查看详情</span>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-3">
                          <div className="space-y-2">
                            {sortedStudentList.map((student, idx) => (
                              <div 
                                key={student.id}
                                className="group cursor-pointer p-2 rounded hover:bg-accent transition-colors text-xs"
                                onClick={() => handleStudentListClick(student)}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium flex items-center gap-1.5">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${idx < 3 ? 'bg-yellow-100 text-yellow-700 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                                      {idx + 1}
                                    </span>
                                    {student.name}
                                  </span>
                                  <span className="font-bold text-primary">{student.score}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full" 
                                    style={{ width: `${student.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>学生详情档案</DialogTitle>
            <DialogDescription>
              {currentStudent && `${currentStudent.name} (ID: ${currentStudent.id}) - ${selectedClass === 'c1' ? '高一(1)班' : selectedClass}`}
            </DialogDescription>
          </DialogHeader>
          
          {currentStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="h-[300px] border rounded-lg p-2 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                 <h4 className="text-xs font-medium text-center mb-1">能力雷达 (个人 vs 班级均值)</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={studentRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                    <Radar
                      name="个人能力"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="班级均值"
                      dataKey="classAvg"
                      stroke="#ef4444" // Red line for class average
                      strokeWidth={2}
                      fill="transparent"
                    />
                    <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    最近练习情况
                  </h4>
                  <div className="space-y-2">
                    {recentPractice.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm border-b border-border pb-1">
                        <span className="truncate max-w-[150px]" title={item.name}>{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={item.score < 70 ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>
                            {item.score}分
                          </span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TriangleAlert className="w-4 h-4 text-orange-500" />
                    常见错误类型
                  </h4>
                  <div className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 p-2 rounded mb-4">
                    该生在<span className="font-medium text-foreground">导数运算</span>中常犯符号错误，在<span className="font-medium text-foreground">立体几何</span>中辅助线构建能力较弱。
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    行动建议
                  </h4>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-800 dark:text-red-200">
                    <p className="mb-2">建议加强<span className="font-bold">概率计算</span>和<span className="font-bold">集合运算</span>的练习。</p>
                    <Button size="sm" variant="outline" className="w-full bg-background hover:bg-accent text-xs h-8 border-red-200 dark:border-red-800">
                      查看推荐练习题 &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Preview Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>分析报告预览</DialogTitle>
            <DialogDescription>
              {assignmentList.find(a => a.id === selectedAssignment)?.name} - 班级学情分析报告
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="border rounded-lg p-6 space-y-4 bg-white dark:bg-slate-950 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold">高一数学阶段性学情分析</h2>
                  <p className="text-sm text-muted-foreground mt-1">生成时间: 2025-12-26</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">班级: 高一(1)班</p>
                  <p className="text-sm text-muted-foreground">科目: 数学</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-sm text-muted-foreground">平均分</p>
                  <p className="text-2xl font-bold text-blue-600">{currentData.metrics.avgScore}</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-sm text-muted-foreground">最高分</p>
                  <p className="text-2xl font-bold text-green-600">98</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded">
                  <p className="text-sm text-muted-foreground">及格率</p>
                  <p className="text-2xl font-bold text-orange-600">92%</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">一、整体概况</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  本次作业整体完成情况良好，班级平均分为{currentData.metrics.avgScore}分，较上次提升了{currentData.metrics.avgScoreGrowth}%。大部分学生能够掌握函数的基础概念，但在复合函数求导的应用上仍存在普遍困难。
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">二、薄弱知识点分析</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-foreground">复合函数求导</span>：错误率68%，主要集中在链式法则的应用错误。</li>
                  <li><span className="font-medium text-foreground">三角恒等变换</span>：错误率62%，学生对倍角公式记忆不牢。</li>
                  <li><span className="font-medium text-foreground">立体几何证明</span>：错误率55%，空间想象能力有待加强。</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">三、教学建议</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  建议下周教学重点针对复合函数求导进行专项训练，增加课堂练习密度。对于空间几何部分，可借助多媒体工具辅助教学，帮助学生建立空间感。
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>取消</Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              导出PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Knowledge Drill Down Dialog (Detailed View) */}
      <Dialog open={!!drillDownKnowledge} onOpenChange={(open) => !open && setDrillDownKnowledge(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">错题详情 - {drillDownKnowledge}</DialogTitle>
          </DialogHeader>
          
          <div className="py-2">
            {/* Summary Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 flex justify-between items-center text-center mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">知识点</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{drillDownKnowledge}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">错误率</p>
                <p className="text-3xl font-bold text-red-500">
                  {currentData.knowledgeError.find(k => k.name === drillDownKnowledge)?.errorRate}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">出错学生数</p>
                <p className="text-3xl font-bold text-orange-500">
                  {currentData.knowledgeError.find(k => k.name === drillDownKnowledge)?.count}
                  <span className="text-base font-normal text-muted-foreground ml-1">人</span>
                </p>
              </div>
            </div>

            {/* Common Error List */}
            <h3 className="font-bold text-base mb-4">常见错题列表</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-4 shadow-sm bg-card">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-medium text-base">求解方程 x² - 5x + 6 = 0</p>
                    <p className="text-sm text-red-500">常见错误：判别式计算错误</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">错误次数</p>
                    <p className="text-xl font-bold text-red-500">8</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 shadow-sm bg-card">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-medium text-base">化简 (x+3)² - (x-2)²</p>
                    <p className="text-sm text-red-500">常见错误：公式套用错误</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">错误次数</p>
                    <p className="text-xl font-bold text-red-500">6</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 shadow-sm bg-card">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-medium text-base">求函数 y=x²-4x+3 的顶点</p>
                    <p className="text-sm text-red-500">常见错误：顶点公式记忆错误</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">错误次数</p>
                    <p className="text-xl font-bold text-red-500">5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Suggestions */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-5 mt-6 border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-bold text-base mb-3 text-yellow-800 dark:text-yellow-200">教学建议</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-yellow-900 dark:text-yellow-100">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                  重点讲解{drillDownKnowledge}的基本概念和解题方法
                </li>
                <li className="flex items-start gap-2 text-sm text-yellow-900 dark:text-yellow-100">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                  针对高错误率题目进行专项练习
                </li>
                <li className="flex items-start gap-2 text-sm text-yellow-900 dark:text-yellow-100">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                  建议组织小组讨论，让学生互相讲解解题思路
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
