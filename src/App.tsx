import { useState, useEffect, useCallback } from 'react'
import './App.css'
import GridView from './components/GridView'
import FeaturedView from './components/FeaturedView'

type Tab = 'featured' | 'all'
type Theme = 'dark' | 'light'

function App() {
  const [tab, setTab] = useState<Tab>('featured')
  const [activeTab, setActiveTab] = useState<Tab>('featured') // Tab actually rendered
  const [isExiting, setIsExiting] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleTabChange = useCallback((newTab: Tab) => {
    if (newTab === activeTab) return
    
    setIsExiting(true)
    setTab(newTab) // Update underline immediately
    
    // Wait for exit animation (snappier transition)
    setTimeout(() => {
      setActiveTab(newTab)
      setIsExiting(false)
    }, 300)
  }, [activeTab])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle between tabs on 'Tab' key press
      if (e.key === 'Tab') {
        e.preventDefault()
        handleTabChange(tab === 'featured' ? 'all' : 'featured')
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [tab, handleTabChange])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <header className="header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀︎' : '⏾'}
        </button>
        <nav className="nav">
          <button 
            className={`nav-item ${tab === 'featured' ? 'active' : ''}`}
            onClick={() => handleTabChange('featured')}
          >
            Featured
          </button>
          <button 
            className={`nav-item ${tab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All
          </button>
          <div className={`nav-underline ${tab}`} />
        </nav>
      </header>

      <main className="main">
        {activeTab === 'featured' && (
          <section className={`view-featured ${isExiting ? 'exiting' : ''}`}>
            <FeaturedView />
          </section>
        )}
        {activeTab === 'all' && (
          <section className="view-all">
            <GridView isExiting={isExiting} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
