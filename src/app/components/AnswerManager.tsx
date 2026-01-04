import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Plus, Edit, Trash, Save } from 'lucide-react';
import { Badge } from './ui/badge';

interface Answer {
  id: string;
  question: string;
  standardAnswer: string;
  keyPoints: string[];
  subject: string;
}

export function AnswerManager() {
  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: '1',
      question: '什么是构造主义学习理论？',
      standardAnswer: '构造主义学习理论认为学习是学习者主动建构知识的过程，强调学习者的主体性和经验的重要性。',
      keyPoints: ['主动建构', '学习者中心', '经验基础'],
      subject: '教育心理学'
    }
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<Partial<Answer>>({
    question: '',
    standardAnswer: '',
    keyPoints: [],
    subject: ''
  });
  const [keyPointInput, setKeyPointInput] = useState('');

  const handleSave = () => {
    if (currentAnswer.id) {
      // 更新
      setAnswers(answers.map(a => a.id === currentAnswer.id ? currentAnswer as Answer : a));
    } else {
      // 新增
      const newAnswer: Answer = {
        id: Date.now().toString(),
        question: currentAnswer.question || '',
        standardAnswer: currentAnswer.standardAnswer || '',
        keyPoints: currentAnswer.keyPoints || [],
        subject: currentAnswer.subject || ''
      };
      setAnswers([...answers, newAnswer]);
    }
    handleCancel();
  };

  const handleEdit = (answer: Answer) => {
    setCurrentAnswer(answer);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setAnswers(answers.filter(a => a.id !== id));
  };

  const handleCancel = () => {
    setCurrentAnswer({ question: '', standardAnswer: '', keyPoints: [], subject: '' });
    setKeyPointInput('');
    setIsEditing(false);
  };

  const addKeyPoint = () => {
    if (keyPointInput.trim()) {
      setCurrentAnswer({
        ...currentAnswer,
        keyPoints: [...(currentAnswer.keyPoints || []), keyPointInput.trim()]
      });
      setKeyPointInput('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setCurrentAnswer({
      ...currentAnswer,
      keyPoints: (currentAnswer.keyPoints || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>标准答案库</h2>
          <p className="text-muted-foreground">配置题目的标准答案和评分要点</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加标准答案
          </Button>
        )}
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{currentAnswer.id ? '编辑标准答案' : '新建标准答案'}</CardTitle>
            <CardDescription>填写题目信息和标准答案</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">学科/科目</Label>
              <Input
                id="subject"
                value={currentAnswer.subject || ''}
                onChange={(e) => setCurrentAnswer({ ...currentAnswer, subject: e.target.value })}
                placeholder="例如：教育心理学"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="question">题目</Label>
              <Textarea
                id="question"
                value={currentAnswer.question || ''}
                onChange={(e) => setCurrentAnswer({ ...currentAnswer, question: e.target.value })}
                placeholder="输入题目内容"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">标准答案</Label>
              <Textarea
                id="answer"
                value={currentAnswer.standardAnswer || ''}
                onChange={(e) => setCurrentAnswer({ ...currentAnswer, standardAnswer: e.target.value })}
                placeholder="输入标准答案"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keypoints">关键得分点</Label>
              <div className="flex gap-2">
                <Input
                  id="keypoints"
                  value={keyPointInput}
                  onChange={(e) => setKeyPointInput(e.target.value)}
                  placeholder="输入关键得分点"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
                />
                <Button type="button" variant="outline" onClick={addKeyPoint}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(currentAnswer.keyPoints || []).map((point, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {point}
                    <button
                      onClick={() => removeKeyPoint(index)}
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

      <div className="space-y-4">
        {answers.map((answer) => (
          <Card key={answer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{answer.question}</CardTitle>
                    <Badge variant="outline">{answer.subject}</Badge>
                  </div>
                  <CardDescription className="mt-2">{answer.standardAnswer}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(answer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(answer.id)}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {answer.keyPoints.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {answer.keyPoints.map((point, index) => (
                    <Badge key={index} variant="secondary">
                      {point}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
