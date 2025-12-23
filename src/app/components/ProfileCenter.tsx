import { useState } from 'react';
import { User, Shield, Bell, FileText, Lock, Check, X as XIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const menuItems = [
  { id: 'profile', label: '个人资料', icon: User },
  { id: 'security', label: '账号安全', icon: Lock },
  { id: 'permissions', label: '权限管理', icon: Shield },
  { id: 'notifications', label: '消息通知设置', icon: Bell },
  { id: 'logs', label: '操作日志', icon: FileText },
];

const permissionMatrix = [
  { module: '工作台', view: true, create: true, edit: true, delete: true },
  { module: '知识库', view: true, create: true, edit: true, delete: false },
  { module: '数据中心', view: true, create: false, edit: false, delete: false },
  { module: '个人中心', view: true, create: false, edit: true, delete: false },
  { module: '团队管理', view: false, create: false, edit: false, delete: false },
];

const operationLogs = [
  { id: 1, action: '创建工作流', module: '工作台', time: '2025-12-21 14:30:25', status: 'success' },
  { id: 2, action: '批改作业', module: '工作台', time: '2025-12-21 10:15:10', status: 'success' },
  { id: 3, action: '上传文档', module: '知识库', time: '2025-12-20 16:45:00', status: 'success' },
  { id: 4, action: '导出报告', module: '数据中心', time: '2025-12-20 09:20:35', status: 'success' },
  { id: 5, action: '修改批改规则', module: '知识库', time: '2025-12-19 15:10:20', status: 'success' },
];

export function ProfileCenter() {
  const [activeMenu, setActiveMenu] = useState('permissions');

  return (
    <div className="flex-1 flex overflow-hidden bg-secondary/30">
      {/* Left Navigation Menu */}
      <div className="w-64 bg-background border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary 
            flex items-center justify-center text-3xl mx-auto mb-3">
            陈
          </div>
          <div className="text-center">
            <h3 className="font-semibold">陈老师</h3>
            <p className="text-sm text-muted-foreground">高级数学教师</p>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeMenu === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3 font-normal"
                  onClick={() => setActiveMenu(item.id)}
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Profile Section */}
        {activeMenu === 'profile' && (
          <div className="max-w-3xl">
            <h2 className="mb-6">个人资料</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">姓名</label>
                  <input
                    type="text"
                    defaultValue="陈老师"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[var(--input-background)] 
                      focus:outline-none focus:ring-2 focus:ring-[var(--ocean-blue)]"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">工号</label>
                  <input
                    type="text"
                    defaultValue="T20231001"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 
                      cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">邮箱</label>
                  <input
                    type="email"
                    defaultValue="chen.teacher@school.edu"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[var(--input-background)] 
                      focus:outline-none focus:ring-2 focus:ring-[var(--ocean-blue)]"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">手机号</label>
                  <input
                    type="tel"
                    defaultValue="138****5678"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[var(--input-background)] 
                      focus:outline-none focus:ring-2 focus:ring-[var(--ocean-blue)]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-2">所属学校</label>
                  <input
                    type="text"
                    defaultValue="某某中学"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[var(--input-background)] 
                      focus:outline-none focus:ring-2 focus:ring-[var(--ocean-blue)]"
                  />
                </div>
              </div>
              <button className="px-6 py-2 rounded-lg bg-[var(--ocean-blue)] text-white 
                hover:bg-[var(--ocean-blue-dark)] transition-all">
                保存修改
              </button>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeMenu === 'security' && (
          <div className="max-w-3xl">
            <h2 className="mb-6">账号安全</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>登录密码</h4>
                    <p className="text-sm text-gray-500">定期修改密码可以提高账号安全性</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border-2 border-[var(--ocean-blue)] text-[var(--ocean-blue)] 
                    hover:bg-[var(--ocean-blue)] hover:text-white transition-all">
                    修改密码
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>双因素认证</h4>
                    <p className="text-sm text-gray-500">已启用 - 提供额外的安全保护</p>
                  </div>
                  <div className="w-12 h-6 bg-[var(--mint-green)] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>登录设备管理</h4>
                    <p className="text-sm text-gray-500">当前3台设备在线</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 
                    hover:border-[var(--ocean-blue)] hover:text-[var(--ocean-blue)] transition-all">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Section */}
        {activeMenu === 'permissions' && (
          <div className="max-w-5xl">
            <h2 className="mb-6">权限管理</h2>
            
            {/* Role Overview Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-2">当前角色：高级教师</h3>
                  <p className="text-sm text-gray-500">
                    拥有工作台、知识库的完整权限，数据中心的查看权限
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-blue-100 text-[var(--ocean-blue)]">
                  Level 2
                </div>
              </div>
            </div>

            {/* Permission Matrix Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3>模块权限矩阵</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--secondary)]">
                    <tr>
                      <th className="px-6 py-4 text-left">模块</th>
                      <th className="px-6 py-4 text-center">查看</th>
                      <th className="px-6 py-4 text-center">创建</th>
                      <th className="px-6 py-4 text-center">修改</th>
                      <th className="px-6 py-4 text-center">删除</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {permissionMatrix.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{row.module}</td>
                        <td className="px-6 py-4 text-center">
                          {row.view ? (
                            <div className="inline-flex w-8 h-8 rounded-full bg-[var(--mint-green)] 
                              items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="inline-flex w-8 h-8 rounded-full bg-gray-200 
                              items-center justify-center">
                              <XIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.create ? (
                            <div className="inline-flex w-8 h-8 rounded-full bg-[var(--mint-green)] 
                              items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="inline-flex w-8 h-8 rounded-full bg-gray-200 
                              items-center justify-center">
                              <XIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.edit ? (
                            <div className="inline-flex w-8 h-8 rounded-full bg-[var(--mint-green)] 
                              items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="inline-flex w-8 h-8 rounded-full bg-gray-200 
                              items-center justify-center">
                              <XIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.delete ? (
                            <div className="inline-flex w-8 h-8 rounded-full bg-[var(--mint-green)] 
                              items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="inline-flex w-8 h-8 rounded-full bg-gray-200 
                              items-center justify-center">
                              <XIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button className="px-6 py-2 rounded-lg border-2 border-[var(--ocean-blue)] text-[var(--ocean-blue)] 
                  hover:bg-[var(--ocean-blue)] hover:text-white transition-all">
                  申请修改权限
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeMenu === 'notifications' && (
          <div className="max-w-3xl">
            <h2 className="mb-6">消息通知设置</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
              {[
                { label: '作业批改完成通知', enabled: true },
                { label: '学生上传作业提醒', enabled: true },
                { label: '系统更新通知', enabled: false },
                { label: '每日数据报告', enabled: true },
                { label: '错误率警报', enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span>{item.label}</span>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${
                    item.enabled ? 'bg-[var(--mint-green)]' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      item.enabled ? 'right-1' : 'left-1'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Section */}
        {activeMenu === 'logs' && (
          <div className="max-w-5xl">
            <h2 className="mb-6">操作日志</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--secondary)]">
                    <tr>
                      <th className="px-6 py-4 text-left">操作</th>
                      <th className="px-6 py-4 text-left">所属模块</th>
                      <th className="px-6 py-4 text-left">时间</th>
                      <th className="px-6 py-4 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {operationLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{log.action}</td>
                        <td className="px-6 py-4 text-gray-600">{log.module}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{log.time}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-[var(--mint-green)] text-white text-sm">
                            成功
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
