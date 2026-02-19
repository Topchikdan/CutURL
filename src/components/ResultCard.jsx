import { QRCodeSVG } from 'qrcode.react'
import './ResultCard.css'

// Компонент карточки с результатом сокращения URL
function ResultCard({ shortUrl, copied, onCopy, onReset }) {
  return (
    <div className="result-card">
      {/* Шапка с заголовком и кнопкой сброса */}
      <div className="result-header">
        <h2>Ссылка сокращена</h2>
        <button className="reset-btn" onClick={onReset}>
          Новая ссылка
        </button>
      </div>

      <div className="result-content">
        {/* Секция с URL-адресами */}
        <div className="url-section">
          {/* Оригинальная ссылка */}
          <div className="url-box">
            <span className="url-label">Оригинальная:</span>
            <a 
              href={shortUrl.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="original-url"
            >
              {shortUrl.originalUrl}
            </a>
          </div>

          {/* Сокращенная ссылка с кнопкой копирования */}
          <div className="url-box short-url-box">
            <span className="url-label">Сокращенная:</span>
            <a 
              href={shortUrl.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="short-url"
            >
              {shortUrl.shortUrl}
            </a>
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={onCopy}
            >
              {copied ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>

        {/* Секция с QR-кодом */}
        <div className="qr-section">
          <h3>QR-код</h3>
          <div className="qr-code-container">
            <QRCodeSVG 
              value={shortUrl.shortUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="qr-hint">Отсканируйте для быстрого доступа</p>
        </div>
      </div>

      {/* Метаинформация */}
      <div className="result-meta">
        <span>Код: {shortUrl.shortCode}</span>
        <span>{new Date(shortUrl.createdAt).toLocaleString('ru-RU')}</span>
      </div>
    </div>
  )
}

export default ResultCard