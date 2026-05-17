import { useState, useEffect } from 'react'
import './App.css'
import GridView from './components/GridView'
import FeaturedView from './components/FeaturedView'

type Tab = 'featured' | 'all'
type Theme = 'dark' | 'light'

function App() {
  const [tab, setTab] = useState<Tab>('featured')
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <button 
            className={`nav-item ${tab === 'featured' ? 'active' : ''}`}
            onClick={() => setTab('featured')}
          >
            Featured
          </button>
          <button 
            className={`nav-item ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            All
          </button>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      
      <main className="main">
        {tab === 'featured' && (
          <section className="view-featured">
            <FeaturedView />
          </section>
        )}
        {tab === 'all' && (
          <section className="view-all">
            <GridView />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
