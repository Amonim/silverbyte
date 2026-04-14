import { useState } from 'react';
import { chatbotData, type ChatBotItem } from '../../data/chatbot';

export default function ChatBotSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatBotItem[][]>([chatbotData]);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  const currentList = history[history.length - 1];

  const handleItemClick = (item: ChatBotItem) => {
    if (item.children) {
      setHistory([...history, item.children]);
    } else if (item.answer) {
      setCurrentAnswer(item.answer);
    }
  };

  const handleBack = () => {
    if (currentAnswer) {
      setCurrentAnswer(null);
    } else if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory([chatbotData]);
    setCurrentAnswer(null);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <h3>Поддержка</h3>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-content">
            {history.length === 1 && !currentAnswer && (
              <p className="chatbot-greeting">Привет! Чем могу помочь?</p>
            )}

            {currentAnswer ? (
              <div className="chatbot-answer">
                <p>{currentAnswer}</p>
              </div>
            ) : (
              <ul className="chatbot-menu">
                {currentList.map(item => (
                  <li key={item.id}>
                    <button
                      className="chatbot-menu-item"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="chatbot-footer">
            {(history.length > 1 || currentAnswer) && (
              <button className="chatbot-nav-btn" onClick={handleBack}>
                Назад
              </button>
            )}
            {(history.length > 1 || currentAnswer) && (
              <button className="chatbot-nav-btn" onClick={handleReset}>
                В начало
              </button>
            )}
          </div>
        </div>
      )}
      <button
        className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Поддержка"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.76 1.54 5.2 3.96 6.8-.2.95-.56 2.05-1.25 3.03l-.22.31h.38c1.4 0 2.8-.4 3.96-1.16 1.05.25 2.14.38 3.25.38 5.52 0 10-3.92 10-8.75S17.52 2 12 2z"></path>
        </svg>
      </button>
    </div>
  );
}
