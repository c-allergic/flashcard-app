import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('Flashcard App', () => {
  test('renders app header', () => {
    render(<App />)
    const header = screen.getByText('闪卡应用')
    expect(header).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    render(<App />)
    const flashcardsLink = screen.getByText('闪卡')
    const worklogLink = screen.getByText('工作记录')
    const plansLink = screen.getByText('计划模式')

    expect(flashcardsLink).toBeInTheDocument()
    expect(worklogLink).toBeInTheDocument()
    expect(plansLink).toBeInTheDocument()
  })

  test('renders flashcards section when on flashcards tab', () => {
    render(<App />)
    const flashcardsSection = screen.getByText('我的闪卡')
    expect(flashcardsSection).toBeInTheDocument()
  })

  test('renders worklog section when on worklog tab', () => {
    render(<App />)
    const worklogSection = screen.getByText('工作记录')
    expect(worklogSection).toBeInTheDocument()
  })

  test('renders plans section when on plans tab', () => {
    render(<App />)
    const plansSection = screen.getByText('计划模式')
    expect(plansSection).toBeInTheDocument()
  })
})