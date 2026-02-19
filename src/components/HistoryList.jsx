import { useState } from 'react'
import './HistoryList.css'

// Компонент истории сокращённых ссылок с возможностью копирования, удаления и очистки
function HistoryList({ history, onCopy, onDelete, onClear }) {
  // ID записи, для которой активно состояние «Скопировано»
  const [copiedId, setCopiedId] = useState(null)

  // Копирует короткую ссылку в буфер обмена и на 2 секунды помечает запись как скопированную
  const handleCopyFromHistory = async (item) => {
    try {
      await navigator.clipboard.writeText(item.shortUrl)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
    }
  }

  // Возвращает относительное время («только что», «5 мин. назад») или дату, если прошло больше суток
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) {
      return 'только что'
    }
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes} мин. назад`
    }
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours} ч. назад`
    }
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Обрезает длинный URL до maxLength символов и добавляет «...»
  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  // Заглушка с иконкой часов, если история пуста
  if (!history || history.length === 0) {
    return (
      <div className="history-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <p>История пока пуста</p>
        <span>Сокращенные ссылки будут отображаться здесь</span>
      </div>
    )
  }

  return (
    <div className="history-container">
      {/* Шапка с заголовком и кнопкой очистки всей истории */}
      <div className="history-header">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          История ({history.length})
        </h2>
        {/* Кнопка «Очистить всё» — показывается только при наличии записей */}
        {history.length > 0 && (
          <button 
            className="clear-history-btn" 
            onClick={onClear}
            title="Очистить историю"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Очистить всё
          </button>
        )}
      </div>

      {/* Список записей истории */}
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-item-content">
              {/* Блок с исходным и сокращённым URL */}
              <div className="history-urls">
                {/* Исходная ссылка — обрезается до 50 символов, полный URL в title */}
                <div className="history-original">
                  <span className="url-label">Исходный:</span>
                  <a 
                    href={item.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={item.originalUrl}
                  >
                    {truncateUrl(item.originalUrl, 50)}
                  </a>
                </div>
                {/* Короткая ссылка открывается в новой вкладке */}
                <div className="history-short">
                  <span className="url-label">Короткий:</span>
                  <a 
                    href={item.shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="short-link"
                  >
                    {item.shortUrl}
                  </a>
                </div>
              </div>
              {/* Относительное время создания ссылки */}
              <div className="history-meta">
                <span className="history-time">{formatDate(item.createdAt)}</span>
              </div>
            </div>
            
            {/* Кнопки действий: копировать и удалить */}
            <div className="history-actions">
              {/* Кнопка копирования — меняет иконку и текст на 2 секунды после нажатия */}
              <button
                className={`copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                onClick={() => handleCopyFromHistory(item)}
                title="Копировать"
              >
                {copiedId === item.id ? (
                  <>
                    {/* Иконка галочки в состоянии «Скопировано» */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Скопировано
                  </>
                ) : (
                  <>
                    {/* Иконка копирования в обычном состоянии */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </>
                )}
              </button>
              
              {/* Кнопка удаления записи из истории */}
              <button
                className="delete-btn"
                onClick={() => onDelete(item.id)}
                title="Удалить"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryList