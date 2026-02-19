import { useState, useEffect } from 'react'
import './App.css'
import UrlForm from './components/UrlForm'
import ResultCard from './components/ResultCard'
import HistoryList from './components/HistoryList'
import { validateURL } from './utils/urlUtils'

// Конфигурация TinyURL API
const TINYURL_API_TOKEN = import.meta.env.VITE_TINYURL_API_TOKEN || ''
const TINYURL_API_URL = 'https://api.tinyurl.com/create'
const HISTORY_STORAGE_KEY = 'cuturl_history'
const MAX_HISTORY_ITEMS = 50

function App() {
  // Состояния компонента
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])

  // Загрузка истории из localStorage при монтировании компонента
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
      }
    } catch (err) {
      console.error('Ошибка загрузки истории:', err)
    }
  }, [])

  // Сохранение истории в localStorage при её изменении
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
    } catch (err) {
      console.error('Ошибка сохранения истории:', err)
    }
  }, [history])

  // Функция для отправки запроса к TinyURL API
  const shortenURL = async (originalUrl) => {
    if (!TINYURL_API_TOKEN) {
      throw new Error('API токен не настроен')
    }

    const response = await fetch(TINYURL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TINYURL_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: originalUrl,
        domain: 'tinyurl.com',
        description: 'Created by CutURL'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('TinyURL API Error:', data)
      throw new Error(data.errors?.[0]?.message || data.errors?.[0] || 'Ошибка API')
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      success: true,
      shortUrl: data.data.tiny_url,
      originalUrl: originalUrl,
      shortCode: data.data.alias,
      createdAt: new Date().toISOString()
    }
  }

  // Добавление элемента в историю
  const addToHistory = (item) => {
    setHistory(prevHistory => {
      // Проверяем, нет ли уже такой ссылки в истории
      const existingIndex = prevHistory.findIndex(
        h => h.originalUrl === item.originalUrl
      )

      let newHistory
      if (existingIndex !== -1) {
        // Если ссылка уже есть, обновляем её и перемещаем наверх
        newHistory = [
          { ...prevHistory[existingIndex], createdAt: item.createdAt },
          ...prevHistory.filter((_, index) => index !== existingIndex)
        ]
      } else {
        // Добавляем новую ссылку в начало
        newHistory = [item, ...prevHistory]
      }

      // Ограничиваем размер истории
      return newHistory.slice(0, MAX_HISTORY_ITEMS)
    })
  }

  // Обработчик сокращения URL
  const handleShorten = async (e) => {
    e.preventDefault()
    setError('')
    setCopied(false)

    // Валидация введенного URL
    if (!url.trim()) {
      setError('Введите URL для сокращения')
      return
    }

    if (!validateURL(url)) {
      setError('Некорректный формат URL')
      return
    }

    setLoading(true)

    try {
      const result = await shortenURL(url)
      setShortUrl(result)
      addToHistory(result) // Добавляем в историю
      setUrl('') // Очищаем поле ввода после успешного сокращения
    } catch (err) {
      setError(err.message || 'Ошибка при сокращении URL. Повторите попытку.')
    } finally {
      setLoading(false)
    }
  }

  // Копирование короткой ссылки в буфер обмена
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Ошибка копирования:', err)
    }
  }

  // Сброс всех состояний
  const handleReset = () => {
    setUrl('')
    setShortUrl(null)
    setError('')
    setCopied(false)
  }

  // Удаление элемента из истории
  const handleDeleteHistoryItem = (id) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id))
  }

  // Очистка всей истории
  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю?')) {
      setHistory([])
    }
  }

  return (
    <div className="app">
      <div className="background-grid"></div>
      <div className="background-gradient"></div>

      <header className="header">
        <div className="logo">
          <h1>CutURL</h1>
        </div>
      </header>

      <main className="main-content">
        <UrlForm
          url={url}
          setUrl={setUrl}
          loading={loading}
          error={error}
          onSubmit={handleShorten}
        />

        {shortUrl && (
          <ResultCard
            shortUrl={shortUrl}
            copied={copied}
            onCopy={handleCopy}
            onReset={handleReset}
          />
        )}

        <HistoryList
          history={history}
          onDelete={handleDeleteHistoryItem}
          onClear={handleClearHistory}
        />
      </main>

      <footer className="footer">
        <p>© 2026 CutURL | Сайт для сокращения ссылок</p>
      </footer>
    </div>
  )
}

export default App