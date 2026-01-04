import { useState } from 'react';
import { RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeletedItem {
  id: string;
  name: string;
  type: '知识点' | '标准答案' | '校验规则';
  deletedBy: string;
  deletedAt: string;
  originalCategory?: string;
}

export function RecycleBin() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DeletedItem | null>(null);
  const [actionType, setActionType] = useState<'restore' | 'delete'>('restore');

  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([
    {
      id: '1',
      name: '皮亚杰认知发展阶段',
      type: '知识点',
      deletedBy: '张老师',
      deletedAt: '2025-12-20 14:30',
      originalCategory: '认知发展'
    },
    {
      id: '2',
      name: '作文批改标准（议论文）',
      type: '标准答案',
      deletedBy: '李老师',
      deletedAt: '2025-12-18 10:15',
      originalCategory: '语文'
    },
    {
      id: '3',
      name: '数学计算题校验',
      type: '校验规则',
      deletedBy: '王老师',
      deletedAt: '2025-12-15 16:45'
    },
    {
      id: '4',
      name: '英语语法-现在完成时',
      type: '知识点',
      deletedBy: '赵老师',
      deletedAt: '2025-12-10 09:20',
      originalCategory: '英语语法'
    }
  ]);

  const handleRestore = (item: DeletedItem) => {
    setSelectedItem(item);
    setActionType('restore');
    setShowConfirmDialog(true);
  };

  const handlePermanentDelete = (item: DeletedItem) => {
    setSelectedItem(item);
    setActionType('delete');
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (!selectedItem) return;

    if (actionType === 'restore') {
      // 恢复逻辑
      setDeletedItems(deletedItems.filter(item => item.id !== selectedItem.id));
    } else {
      // 永久删除逻辑
      setDeletedItems(deletedItems.filter(item => item.id !== selectedItem.id));
    }

    setShowConfirmDialog(false);
    setSelectedItem(null);
  };

  const handleClearAll = () => {
    if (confirm('确定要清空回收站吗？所有项目将被永久删除且无法恢复！')) {
      setDeletedItems([]);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    const variants = {
      '知识点': 'default',
      '标准答案': 'secondary',
      '校验规则': 'outline'
    };
    return variants[type as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>回收站</h2>
          <p className="text-muted-foreground">已删除的项目将在此保留30天</p>
        </div>
        {deletedItems.length > 0 && (
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="mr-2 h-4 w-4" />
            清空回收站
          </Button>
        )}
      </div>

      {/* Empty State */}
      {deletedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Trash2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">回收站为空</h3>
          <p className="text-sm text-muted-foreground">删除的项目将显示在这里</p>
        </div>
      ) : (
        <>
          {/* Info Alert */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                回收站中的项目将在30天后自动永久删除
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                请及时恢复需要保留的内容，或永久删除不需要的项目
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>原始分类</TableHead>
                  <TableHead>删除人</TableHead>
                  <TableHead>删除时间</TableHead>
                  <TableHead className="w-40">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(item.type) as any}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.originalCategory || '-'}</TableCell>
                    <TableCell>{item.deletedBy}</TableCell>
                    <TableCell className="text-muted-foreground">{item.deletedAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(item)}
                        >
                          <RotateCcw className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePermanentDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              共 {deletedItems.length} 个已删除项目
            </div>
            <div>
              包含：
              {Object.entries(
                deletedItems.reduce((acc, item) => {
                  acc[item.type] = (acc[item.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count], index, arr) => (
                <span key={type}>
                  {type} {count} 个
                  {index < arr.length - 1 ? '、' : ''}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'restore' ? '确认恢复' : '确认永久删除'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'restore' 
                ? `确定要恢复"${selectedItem?.name}"吗？项目将返回到原来的位置。`
                : `确定要永久删除"${selectedItem?.name}"吗？此操作无法撤销！`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionType === 'restore' ? '恢复' : '永久删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
