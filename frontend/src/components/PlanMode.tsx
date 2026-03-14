import React, { useState } from 'react'
import { aiService } from '../services/ai'

interface Plan {
  id: string
  title: string
  content: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
  dueDate: Date
}

interface PlanModeProps {
  plans: Plan[]
  onAddPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => void
  onEditPlan: (plan: Plan) => void
  onDeletePlan: (id: string) => void
  onToggleStatus: (id: string, status: Plan['status']) => void
}

const PlanModeComponent: React.FC<PlanModeProps> = ({ plans, onAddPlan, onEditPlan, onDeletePlan, onToggleStatus }) => {
  const [newPlan, setNewPlan] = useState<Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    content: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date()
  })

  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)

  const handleAddPlan = () => {
    if (newPlan.title.trim()) {
      onAddPlan(newPlan)
      setNewPlan({
        title: '',
        content: '',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date()
      })
    }
  }

  const handleGeneratePlan = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    try {
      let generatedPlan: string
      try {
        generatedPlan = await aiService.generatePlan(aiPrompt)
      } catch (error) {
        generatedPlan = `基于"${aiPrompt}"生成的计划。由于AI服务暂时不可用，这是一个占位符内容。您可以手动编辑此计划。`
        console.log('AI service unavailable, using placeholder')
      }

      onAddPlan({
        title: `AI: ${aiPrompt.substring(0, 20)}${aiPrompt.length > 20 ? '...' : ''}`,
        content: generatedPlan,
        status: 'pending',
        priority: 'medium',
        dueDate: new Date()
      })

      setAiPrompt('')
      setShowAIPanel(false)
    } catch (error) {
      console.error('Failed to generate plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🔄'
      case 'pending': return '📋'
      default: return '📋'
    }
  }

  return (
    <div className="plan-mode">
      <h2>📋 计划模式</h2>

      {/* 添加计划表单 */}
      <div className="plan-input">
        <input
          type="text"
          placeholder="✏️ 计划标题..."
          value={newPlan.title}
          onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
        />
        <textarea
          placeholder="📝 计划内容描述..."
          value={newPlan.content}
          onChange={(e) => setNewPlan({ ...newPlan, content: e.target.value })}
        />
        <div className="plan-controls">
          <select
            value={newPlan.priority}
            onChange={(e) => setNewPlan({ ...newPlan, priority: e.target.value as Plan['priority'] })}
          >
            <option value="low">🟢 低优先级</option>
            <option value="medium">🟡 中优先级</option>
            <option value="high">🔴 高优先级</option>
          </select>
          <input
            type="date"
            value={newPlan.dueDate.toISOString().split('T')[0]}
            onChange={(e) => setNewPlan({ ...newPlan, dueDate: new Date(e.target.value) })}
          />
          <button onClick={handleAddPlan}>➕ 添加计划</button>
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            style={{
              background: showAIPanel
                ? 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
                : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
            }}
          >
            {showAIPanel ? '❌ 关闭AI' : '🤖 AI生成'}
          </button>
        </div>
      </div>

      {/* AI 生成面板 */}
      {showAIPanel && (
        <div className="ai-generation" style={{
          animation: 'slideIn 0.4s ease-out'
        }}>
          <h3>🤖 AI 智能计划生成</h3>
          <textarea
            placeholder="描述你想要生成的计划，例如：'帮我制定一个今天的工作计划' 或 '安排本周的学习任务'..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating || !aiPrompt.trim()}
            style={{
              background: isGenerating
                ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {isGenerating ? '⏳ 生成中...' : '✨ 一键生成计划'}
          </button>
        </div>
      )}

      {/* 计划列表统计 */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          📊 总计划: <strong>{plans.length}</strong>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          📋 待完成: <strong style={{ color: '#ed8936' }}>{plans.filter(p => p.status === 'pending').length}</strong>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          🔄 进行中: <strong style={{ color: '#4299e1' }}>{plans.filter(p => p.status === 'in-progress').length}</strong>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          ✅ 已完成: <strong style={{ color: '#48bb78' }}>{plans.filter(p => p.status === 'completed').length}</strong>
        </div>
      </div>

      {/* 计划列表 */}
      <div className="plans-list">
        {plans.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--gray)',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p>暂无计划</p>
            <p style={{ fontSize: '0.9rem' }}>添加你的第一个计划吧！</p>
          </div>
        ) : (
          plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`plan ${plan.status} ${plan.priority}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="plan-header">
                <h3>
                  <span style={{ marginRight: '0.5rem' }}>{getStatusIcon(plan.status)}</span>
                  {plan.title}
                </h3>
                <div className="plan-status">
                  <span style={{ marginRight: '0.5rem' }}>{getPriorityIcon(plan.priority)}</span>
                  <select
                    value={plan.status}
                    onChange={(e) => onToggleStatus(plan.id, e.target.value as Plan['status'])}
                  >
                    <option value="pending">📋 待办</option>
                    <option value="in-progress">🔄 进行中</option>
                    <option value="completed">✅ 已完成</option>
                  </select>
                </div>
              </div>
              <p>{plan.content}</p>
              <div className="plan-footer">
                <span>截止: {new Date(plan.dueDate).toLocaleDateString()}</span>
                <div className="plan-actions">
                  <button onClick={() => onEditPlan(plan)}>✏️ 编辑</button>
                  <button onClick={() => onDeletePlan(plan.id)}>🗑️ 删除</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PlanModeComponent