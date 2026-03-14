import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import FlashcardComponent from './components/Flashcard'
import WorkLogComponent from './components/WorkLog'
import PlanModeComponent from './components/PlanMode'
import { flashcardApi, worklogApi, planApi } from './services/api'
import { indexedDBService } from './services/indexeddb'

interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface WorkLog {
  id: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

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

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [worklogs, setWorklogs] = useState<WorkLog[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [activeTab, setActiveTab] = useState<'flashcards' | 'worklog' | 'plans'>('flashcards')

  const [showAddForm, setShowAddForm] = useState(false)
  const [newFlashcard, setNewFlashcard] = useState({
    question: '',
    answer: '',
    category: '',
    tags: ''
  })

  const [showWorklogForm, setShowWorklogForm] = useState(false)
  const [newWorklog, setNewWorklog] = useState({
    content: '',
    category: '',
    tags: ''
  })

  useEffect(() => {
    indexedDBService.init()
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const localFlashcards = await indexedDBService.getAll('flashcards')
      const localWorklogs = await indexedDBService.getAll('worklogs')
      const localPlans = await indexedDBService.getAll('plans')

      if (localFlashcards.length > 0) setFlashcards(localFlashcards)
      if (localWorklogs.length > 0) setWorklogs(localWorklogs)
      if (localPlans.length > 0) setPlans(localPlans)

      if (localFlashcards.length === 0 && localWorklogs.length === 0 && localPlans.length === 0) {
        const sampleFlashcards = [
          {
            id: '1',
            question: 'React是什么？',
            answer: 'React是一个用于构建用户界面的JavaScript库。',
            category: '前端',
            tags: ['JavaScript', 'React'],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            question: '什么是虚拟DOM？',
            answer: '虚拟DOM是真实DOM的内存表示，它允许React更高效地更新UI。',
            category: '前端',
            tags: ['React', 'DOM'],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]

        const sampleWorklogs = [
          {
            id: '1',
            content: '完成了闪卡应用的前端开发，添加了基本的CRUD功能。',
            category: '开发',
            tags: ['React', 'TypeScript'],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]

        const samplePlans = [
          {
            id: '1',
            title: '完善后端API',
            content: '实现所有RESTful API端点，包括认证、数据同步和备份功能。',
            status: 'pending',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        ]

        setFlashcards(sampleFlashcards)
        setWorklogs(sampleWorklogs)
        setPlans(samplePlans)

        for (const card of sampleFlashcards) {
          await indexedDBService.add('flashcards', card)
        }
        for (const log of sampleWorklogs) {
          await indexedDBService.add('worklogs', log)
        }
        for (const plan of samplePlans) {
          await indexedDBService.add('plans', plan)
        }
      }

      try {
        const [apiFlashcards, apiWorklogs, apiPlans] = await Promise.all([
          flashcardApi.getAll(),
          worklogApi.getAll(),
          planApi.getAll()
        ])

        if (apiFlashcards.data) setFlashcards(apiFlashcards.data)
        if (apiWorklogs.data) setWorklogs(apiWorklogs.data)
        if (apiPlans.data) setPlans(apiPlans.data)
      } catch (apiError) {
        console.log('API not available, using local data only')
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
      setFlashcards([])
      setWorklogs([])
      setPlans([])
    }
  }

  const handleAddFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFlashcard.question && newFlashcard.answer) {
      handleAddFlashcard({
        question: newFlashcard.question,
        answer: newFlashcard.answer,
        category: newFlashcard.category || '默认',
        tags: newFlashcard.tags ? newFlashcard.tags.split(',').map(t => t.trim()) : []
      })
      setNewFlashcard({ question: '', answer: '', category: '', tags: '' })
      setShowAddForm(false)
    }
  }

  const handleWorklogFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newWorklog.content) {
      handleAddWorklog({
        content: newWorklog.content,
        category: newWorklog.category || '默认',
        tags: newWorklog.tags ? newWorklog.tags.split(',').map(t => t.trim()) : []
      })
      setNewWorklog({ content: '', category: '', tags: '' })
      setShowWorklogForm(false)
    }
  }

  const handleAddFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = Date.now().toString()
      const newFlashcardObj = {
        ...flashcard,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setFlashcards([...flashcards, newFlashcardObj])
      await indexedDBService.add('flashcards', newFlashcardObj)

      try {
        await flashcardApi.create(flashcard)
      } catch (apiError) {
        console.log('API sync failed, but data saved locally')
      }
    } catch (error) {
      console.error('Failed to add flashcard:', error)
    }
  }

  const handleEditFlashcard = async (flashcard: Flashcard) => {
    try {
      const updatedFlashcard = { ...flashcard, updatedAt: new Date() }
      setFlashcards(flashcards.map(f => f.id === flashcard.id ? updatedFlashcard : f))
      await indexedDBService.update('flashcards', updatedFlashcard)

      try {
        await flashcardApi.update(flashcard.id, flashcard)
      } catch (apiError) {
        console.log('API sync failed, but data saved locally')
      }
    } catch (error) {
      console.error('Failed to update flashcard:', error)
    }
  }

  const handleDeleteFlashcard = async (id: string) => {
    try {
      setFlashcards(flashcards.filter(f => f.id !== id))
      await indexedDBService.delete('flashcards', id)

      try {
        await flashcardApi.delete(id)
      } catch (apiError) {
        console.log('API delete failed, but data removed locally')
      }
    } catch (error) {
      console.error('Failed to delete flashcard:', error)
    }
  }

  const handleAddWorklog = async (worklog: Omit<WorkLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = Date.now().toString()
      const newWorklogObj = {
        ...worklog,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setWorklogs([...worklogs, newWorklogObj])
      await indexedDBService.add('worklogs', newWorklogObj)

      try {
        await worklogApi.create(worklog)
      } catch (apiError) {
        console.log('API sync failed, but data saved locally')
      }
    } catch (error) {
      console.error('Failed to add worklog:', error)
    }
  }

  const handleEditWorklog = async (worklog: WorkLog) => {
    try {
      const updatedWorklog = { ...worklog, updatedAt: new Date() }
      setWorklogs(worklogs.map(w => w.id === worklog.id ? updatedWorklog : w))
      await indexedDBService.update('worklogs', updatedWorklog)

      try {
        await worklogApi.update(worklog.id, worklog)
      } catch (apiError) {
        console.log('API sync failed, but data saved locally')
      }
    } catch (error) {
      console.error('Failed to update worklog:', error)
    }
  }

  const handleDeleteWorklog = async (id: string) => {
    try {
      setWorklogs(worklogs.filter(w => w.id !== id))
      await indexedDBService.delete('worklogs', id)

      try {
        await worklogApi.delete(id)
      } catch (apiError) {
        console.log('API delete failed, but data removed locally')
      }
    } catch (error) {
      console.error('Failed to delete worklog:', error)
    }
  }

  const handleAddPlan = async (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = Date.now().toString()
      const fullPlan = {
        ...plan,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setPlans([...plans, fullPlan])
      await indexedDBService.add('plans', fullPlan)

      try {
        await planApi.create(plan)
      } catch (apiError) {
        console.log('API sync failed, but plan saved locally')
      }
    } catch (error) {
      console.error('Failed to add plan:', error)
    }
  }

  const handleEditPlan = async (plan: Plan) => {
    try {
      const updatedPlan = { ...plan, updatedAt: new Date() }
      setPlans(plans.map(p => p.id === plan.id ? updatedPlan : p))
      await indexedDBService.update('plans', updatedPlan)

      try {
        await planApi.update(plan.id, plan)
      } catch (apiError) {
        console.log('API sync failed, but plan updated locally')
      }
    } catch (error) {
      console.error('Failed to update plan:', error)
    }
  }

  const handleDeletePlan = async (id: string) => {
    try {
      setPlans(plans.filter(p => p.id !== id))
      await indexedDBService.delete('plans', id)

      try {
        await planApi.delete(id)
      } catch (apiError) {
        console.log('API delete failed, but plan removed locally')
      }
    } catch (error) {
      console.error('Failed to delete plan:', error)
    }
  }

  const handleTogglePlanStatus = async (id: string, status: Plan['status']) => {
    const plan = plans.find(p => p.id === id)
    if (plan) {
      const updatedPlan = { ...plan, status }
      await handleEditPlan(updatedPlan)
    }
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>闪卡应用</h1>
          <nav className="app-nav">
            <Link to="/" className={activeTab === 'flashcards' ? 'active' : ''} onClick={() => setActiveTab('flashcards')}>闪卡</Link>
            <Link to="/worklog" className={activeTab === 'worklog' ? 'active' : ''} onClick={() => setActiveTab('worklog')}>工作记录</Link>
            <Link to="/plans" className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>计划模式</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <div className="flashcards">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{
  fontSize: '1.8rem',
  color: '#ffffff',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  margin: 0
}}>📚 我的闪卡</h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {showAddForm ? '取消' : '添加闪卡'}
                  </button>
                </div>

                {showAddForm && (
                  <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <form onSubmit={handleAddFormSubmit}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="问题"
                          value={newFlashcard.question}
                          onChange={(e) => setNewFlashcard({...newFlashcard, question: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="答案"
                          value={newFlashcard.answer}
                          onChange={(e) => setNewFlashcard({...newFlashcard, answer: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="分类"
                          value={newFlashcard.category}
                          onChange={(e) => setNewFlashcard({...newFlashcard, category: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <input
                          type="text"
                          placeholder="标签 (用逗号分隔)"
                          value={newFlashcard.tags}
                          onChange={(e) => setNewFlashcard({...newFlashcard, tags: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#2ecc71',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        保存闪卡
                      </button>
                    </form>
                  </div>
                )}

                <p style={{
  color: '#ffffff',
  fontSize: '1.1rem',
  fontWeight: 500,
  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
}}>当前闪卡数量: <strong>{flashcards.length}</strong></p>
                <div className="flashcards-list">
                  {flashcards.length > 0 ? (
                    flashcards.map(flashcard => (
                      <FlashcardComponent
                        key={flashcard.id}
                        flashcard={flashcard}
                        onEdit={handleEditFlashcard}
                        onDelete={handleDeleteFlashcard}
                      />
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '16px',
                      color: '#2d3748'
                    }}>
                      <p style={{ fontSize: '1.2rem' }}>暂无闪卡数据</p>
                      <p style={{ fontSize: '0.9rem', color: '#718096' }}>点击上方"添加闪卡"创建第一张卡片</p>
                    </div>
                  )}
                </div>
              </div>
            } />

            <Route path="/worklog" element={
              <div className="worklog">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{
  fontSize: '1.8rem',
  color: '#ffffff',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  margin: 0
}}>📝 工作记录</h2>
                  <button
                    onClick={() => setShowWorklogForm(!showWorklogForm)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {showWorklogForm ? '取消' : '添加工作记录'}
                  </button>
                </div>

                {showWorklogForm && (
                  <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <form onSubmit={handleWorklogFormSubmit}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <textarea
                          placeholder="工作记录内容"
                          value={newWorklog.content}
                          onChange={(e) => setNewWorklog({...newWorklog, content: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="分类"
                          value={newWorklog.category}
                          onChange={(e) => setNewWorklog({...newWorklog, category: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <input
                          type="text"
                          placeholder="标签 (用逗号分隔)"
                          value={newWorklog.tags}
                          onChange={(e) => setNewWorklog({...newWorklog, tags: e.target.value})}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#2ecc71',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        保存工作记录
                      </button>
                    </form>
                  </div>
                )}

                <p style={{
  color: '#ffffff',
  fontSize: '1.1rem',
  fontWeight: 500,
  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
}}>当前工作记录数量: <strong>{worklogs.length}</strong></p>
                <div className="worklogs-list">
                  {worklogs.length > 0 ? (
                    worklogs.map(worklog => (
                      <WorkLogComponent
                        key={worklog.id}
                        workLog={worklog}
                        onEdit={handleEditWorklog}
                        onDelete={handleDeleteWorklog}
                      />
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '16px',
                      color: '#2d3748'
                    }}>
                      <p style={{ fontSize: '1.2rem' }}>暂无工作记录</p>
                      <p style={{ fontSize: '0.9rem', color: '#718096' }}>点击上方"添加工作记录"创建第一条记录</p>
                    </div>
                  )}
                </div>
              </div>
            } />

            <Route path="/plans" element={
              <PlanModeComponent
                plans={plans}
                onAddPlan={handleAddPlan}
                onEditPlan={handleEditPlan}
                onDeletePlan={handleDeletePlan}
                onToggleStatus={handleTogglePlanStatus}
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App