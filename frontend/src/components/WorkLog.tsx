import React from 'react'

interface WorkLog {
  id: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface WorkLogProps {
  workLog: WorkLog
  onEdit: (workLog: WorkLog) => void
  onDelete: (id: string) => void
}

const WorkLogComponent: React.FC<WorkLogProps> = ({ workLog, onEdit, onDelete }) => {
  return (
    <div className="work-log">
      <div className="work-log-meta">
        <span className="category">{workLog.category}</span>
        <span>{new Date(workLog.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="work-log-content">
        <p className="work-log-text">{workLog.content}</p>
      </div>
      <div className="work-log-tags">
        {workLog.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      <div className="work-log-actions">
        <button onClick={() => onEdit(workLog)}>✏️ 编辑</button>
        <button onClick={() => onDelete(workLog.id)}>🗑️ 删除</button>
      </div>
    </div>
  )
}

export default WorkLogComponent