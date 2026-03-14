import React, { useState } from 'react'

interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface FlashcardProps {
  flashcard: Flashcard
  onEdit: (flashcard: Flashcard) => void
  onDelete: (id: string) => void
}

const FlashcardComponent: React.FC<FlashcardProps> = ({ flashcard, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <h3>{flashcard.question}</h3>
          <div className="flashcard-meta">
            <span className="category">{flashcard.category}</span>
            <div className="tags">
              {flashcard.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flashcard-back">
          <h3>答案</h3>
          <p>{flashcard.answer}</p>
          <div className="flashcard-actions">
            <button onClick={(e) => { e.stopPropagation(); onEdit(flashcard) }}>✏️ 编辑</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(flashcard.id) }}>🗑️ 删除</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashcardComponent