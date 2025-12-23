import { useState } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, CircleCheck, TriangleAlert, X, MoreHorizontal, LayoutDashboard, PieChart, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

const knowledgePointData = [
  { name: '函数', errorRate: 45, students: 18 },
  { name: '导数', errorRate: 32, students: 13 },
  { name: '几何', errorRate: 28, students: 11 },
  { name: '三角函数', errorRate: 23, students: 9 },
  { name: '数列', errorRate: 18, students: 7 },
  { name: '概率统计', errorRate: 15, students: 6 },
];

const studentRadarData = [
  { subject: '函数', score: 65, classAverage: 75, fullMark: 100 },
  { subject: '导数', score: 78, classAverage: 70, fullMark: 100 },
  { subject: '几何', score: 82, classAverage: 80, fullMark: 100 },
  { subject: '三角函数', score: 88, classAverage: 85, fullMark: 100 },
  { subject: '数列', score: 92, classAverage: 78, fullMark: 100 },
  { subject: '概率统计', score: 85, classAverage: 82, fullMark: 100 },
];

const students = [
  { id: 1, name: '张三', average: 85, status: 'good' },
  { id: 2, name: '李四', average: 92, status: 'excellent' },
  { id: 3, name: '王五', average: 78, status: 'good' },
  { id: 4, name: '赵六', average: 65, status: 'warning' },
  { id: 5, name: '陈七', average: 88, status: 'good' },
  { id: 6, name: '钱八', average: 72, status: 'warning' },
  { id: 7, name: '孙九', average: 95, status: 'excellent' },
];

const scoreDistribution = [
  { range: '90-100', count: 5 },
  { range: '80-89', count: 15 },
  { range: '70-79', count: 12 },
  { range: '60-69', count: 6 },
  { range: '<60', count: 2 },
];

const subjectAverages = [
  { subject: '函数', classAvg: 75, gradeAvg: 72 },
  { subject: '导数', classAvg: 70, gradeAvg: 68 },
  { subject: '几何', classAvg: 80, gradeAvg: 78 },
  { subject: '三角函数', classAvg: 85, gradeAvg: 82 },
  { subject: '数列', classAvg: 78, gradeAvg: 75 },
];

const studentTrendData = [
  { exam: '第一次月考', score: 75, rank: 15 },
  { exam: '期中考试', score: 82, rank: 8 },
  { exam: '第二次月考', score: 78, rank: 12 },
  { exam: '期末模拟', score: 88, rank: 5 },
];

const examList = [
  { id: 1, name: '2025-2026学年第一学期期末考试', date: '2026-01-15', type: '期末考试', status: '已发布', avgScore: 82.5 },
  { id: 2, name: '高一数学12月月考', date: '2025-12-20', type: '月考', status: '已发布', avgScore: 78.4 },
  { id: 3, name: '第三章导数单元测试', date: '2025-11-30', type: '单元测试', status: '已发布', avgScore: 75.2 },
  { id: 4, name: '高一数学期中考试', date: '2025-11-10', type: '期中考试', status: '已发布', avgScore: 80.1 },
];

export function DataHub() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [highlightedBar, setHighlightedBar] = useState<number | null>(null);

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-secondary/30">
      {/* Secondary Sidebar */}
      <div className="w-64 bg-background border-r border-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold px-2">数据中心</h2>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            <Button 
              variant={activeView === 'dashboard' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3 font-normal"
              onClick={() => setActiveView('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              总览看板
            </Button>
            <Button 
              variant={activeView === 'class' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3 font-normal"
              onClick={() => setActiveView('class')}
            >
              <PieChart className="w-4 h-4 text-muted-foreground" />
              班级分析
            </Button>
            <Button 
              variant={activeView === 'student' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3 font-normal"
              onClick={() => setActiveView('student')}
            >
              <Users className="w-4 h-4 text-muted-foreground" />
              学生画像
            </Button>
            <Button 
              variant={activeView === 'reports' ? "secondary" : "ghost"} 
              className="w-full justify-start gap-3 font-normal"
              onClick={() => setActiveView('reports')}
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              考试报告
            </Button>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" />
            数据设置
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="h-16 flex items-center px-8 border-b border-border bg-card/50 backdrop-blur-sm">
          <h1 className="text-xl font-semibold tracking-tight">学情分析看板</h1>
        </div>

        <ScrollArea className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">班级平均分</span>
                        <div className="p-2 bg-primary/10 rounded-full">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">82.5</span>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          ↑ 5.2%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">批改完成</span>
                        <div className="p-2 bg-green-500/10 rounded-full">
                          <CircleCheck className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">156</span>
                        <span className="text-sm text-muted-foreground">/ 160 份</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">参与学生</span>
                        <div className="p-2 bg-blue-500/10 rounded-full">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">40</span>
                        <span className="text-sm text-muted-foreground">名学生</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">薄弱知识点</span>
                        <div className="p-2 bg-red-500/10 rounded-full">
                          <TriangleAlert className="w-4 h-4 text-red-600" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">3</span>
                        <Badge variant="secondary" className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
                          需关注
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart - Knowledge Point Error Rates */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle>知识点错误率分析</CardTitle>
                      <CardDescription>最近一次考试各知识点掌握情况</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          data={knowledgePointData}
                          onMouseMove={(state) => {
                            if (state.activeTooltipIndex !== undefined) {
                              setHighlightedBar(state.activeTooltipIndex);
                            }
                          }}
                          onMouseLeave={() => setHighlightedBar(null)}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="var(--muted-foreground)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="var(--muted-foreground)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value}%`} 
                          />
                          <Tooltip 
                            cursor={{ fill: 'var(--muted)' }}
                            contentStyle={{ 
                              borderRadius: 'var(--radius)', 
                              border: '1px solid var(--border)',
                              boxShadow: 'var(--shadow-md)'
                            }}
                          />
                          <Bar dataKey="errorRate" radius={[4, 4, 0, 0]}>
                            {knowledgePointData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === highlightedBar ? 'var(--primary)' : 'var(--ocean-blue-light)'} 
                                opacity={index === highlightedBar ? 1 : 0.7}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Student List */}
                  <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>学生表现概览</CardTitle>
                        <CardDescription>按平均分排序</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setActiveView('student')}>查看全部</Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-1 p-4 pt-0">
                          {students.map((student, index) => (
                            <div
                              key={student.id}
                              onClick={() => {
                                setSelectedStudent(student);
                                setActiveView('student');
                              }}
                              className={`
                                flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                                ${selectedStudent?.id === student.id 
                                  ? 'bg-primary/5 border border-primary/20' 
                                  : 'hover:bg-muted border border-transparent'}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                                  {student.name[0]}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{student.name}</div>
                                  <div className="text-xs text-muted-foreground">ID: 20240{student.id}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="font-medium text-sm">{student.average}分</div>
                                  <div className={`text-xs ${
                                    student.status === 'excellent' ? 'text-green-600' :
                                    student.status === 'warning' ? 'text-red-600' : 'text-blue-600'
                                  }`}>
                                    {student.status === 'excellent' ? '优秀' :
                                     student.status === 'warning' ? '需加油' : '良好'}
                                  </div>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Class Analysis View */}
            {activeView === 'class' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>分数段分布</CardTitle>
                      <CardDescription>全班成绩分布情况</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={scoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>学科平均分对比</CardTitle>
                      <CardDescription>班级 vs 年级平均分</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={subjectAverages}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Bar name="班级平均" dataKey="classAvg" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            <Bar name="年级平均" dataKey="gradeAvg" fill="var(--muted-foreground)" opacity={0.3} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Student Profile View */}
            {activeView === 'student' && (
              <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4">
                {/* Student Selector */}
                <Card className="w-64 flex-shrink-0 h-[600px] flex flex-col">
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-sm">学生列表</CardTitle>
                  </CardHeader>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                      {students.map(student => (
                        <div
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                            selectedStudent?.id === student.id ? 'bg-secondary' : 'hover:bg-muted'
                          }`}
                        >
                          <span className="text-sm font-medium">{student.name}</span>
                          <Badge variant={student.status === 'excellent' ? 'default' : 'secondary'} className="text-xs scale-90">
                            {student.average}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Detailed Analysis */}
                <div className="flex-1 space-y-6">
                  {selectedStudent ? (
                    <>
                      <div className="grid grid-cols-2 gap-6">
                         <Card>
                          <CardHeader>
                            <CardTitle>{selectedStudent.name} - 能力雷达</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={studentRadarData}>
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="subject" />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                  <Radar name={selectedStudent.name} dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                                  <Radar name="班级平均" dataKey="classAverage" stroke="var(--muted-foreground)" fill="var(--muted)" fillOpacity={0.1} />
                                  <Tooltip />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>成绩趋势</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={studentTrendData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                  <XAxis dataKey="exam" />
                                  <YAxis />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      请选择一名学生查看详情
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reports View */}
            {activeView === 'reports' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {examList.map(exam => (
                      <Card key={exam.id} className="cursor-pointer hover:border-primary transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                             <Badge variant="outline">{exam.type}</Badge>
                             <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">{exam.status}</Badge>
                          </div>
                          <CardTitle className="text-lg mt-2">{exam.name}</CardTitle>
                          <CardDescription>{exam.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="flex justify-between items-end">
                             <div>
                               <div className="text-xs text-muted-foreground">平均分</div>
                               <div className="text-2xl font-bold">{exam.avgScore}</div>
                             </div>
                             <Button size="sm" variant="secondary">查看报告</Button>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
              </div>
            )}

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
