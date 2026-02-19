// Компонент формы для ввода URL
const UrlForm = ({ url, setUrl, loading, error, onSubmit }) => {
  return (
    <div className="url-form-card">
      <form onSubmit={onSubmit}>
        {/* Заголовок формы */}
        <div className="form-header">
          <h2>Введите URL для сокращения</h2>
          <p>Трансформируем длинные ссылки в компактные за миллисекунды</p>
        </div>

        {/* Поле ввода и кнопка отправки */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="https://example.com/very/long/url/path..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="url-input"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Обработка...</span>
              </>
            ) : (
              <>
                <span>Сократить</span>
              </>
            )}
          </button>
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  )
}

export default UrlForm