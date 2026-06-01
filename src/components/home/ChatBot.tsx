import { useState, useEffect, useRef } from 'react';
import { chatbotData, type ChatBotItem } from '../../data/chatbot';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: ChatBotItem[];
};

export default function ChatBotSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Здравствуйте! Я виртуальный помощник SilverByte. Выберите тему вопроса или напишите свой запрос.',
          options: chatbotData,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = (text: string, isFromOption = false) => {
    if (!text.trim()) return;

    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text },
    ]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      processUserQuery(text, isFromOption);
    }, 600);
  };

  const processUserQuery = (query: string, isFromOption: boolean) => {
    setIsTyping(false);
    const q = query.toLowerCase();

    if (isFromOption) {
      const allItems: ChatBotItem[] = [];
      const extract = (items: ChatBotItem[]) => {
        items.forEach((i) => {
          allItems.push(i);
          if (i.children) extract(i.children);
        });
      };
      extract(chatbotData);

      const found = allItems.find((i) => i.title === query);
      if (found) {
        if (found.children) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'bot',
              text: `Вот популярные вопросы по теме "${found.title}":`,
              options: found.children,
            },
          ]);
        } else if (found.answer) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), sender: 'bot', text: found.answer as string },
          ]);
        }
        return;
      }
    }

    const results: ChatBotItem[] = [];
    const search = (items: ChatBotItem[]) => {
      items.forEach((i) => {
        if (
          i.title.toLowerCase().includes(q) ||
          (i.answer && i.answer.toLowerCase().includes(q))
        ) {
          if (!i.children) results.push(i);
        }
        if (i.children) search(i.children);
      });
    };
    search(chatbotData);

    if (results.length > 0) {
      if (results.length === 1 && results[0].answer) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: 'bot', text: results[0].answer! },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'bot',
            text: 'Я нашел несколько подходящих ответов:',
            options: results.slice(0, 5),
          },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Извините, я не совсем понял ваш запрос. Попробуйте выбрать одну из популярных тем ниже.',
          options: chatbotData,
        },
      ]);
    }
  };

  const handleSupport = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: 'Связаться с поддержкой',
      },
    ]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Если мы не смогли решить вашу проблему, вы можете обратиться в службу поддержки SilverByte.\n\nEmail: aryn.abiev97@gmail.com\nТелефон: +7 (776) 148-81-04',
        },
      ]);
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Здравствуйте! Я виртуальный помощник SilverByte. Выберите тему вопроса или напишите свой запрос.',
        options: chatbotData,
      },
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-panel chatbot-panel--modern">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">SB</div>
              <div>
                <h3>Помощник SilverByte</h3>
                <span className="chatbot-status">Онлайн</span>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
                {msg.sender === 'bot' && <div className="chatbot-message-avatar">SB</div>}
                <div className="chatbot-message-content">
                  <div className="chatbot-bubble">{msg.text}</div>
                  {msg.options && msg.options.length > 0 && (
                    <div className="chatbot-options">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.id}
                          className="chatbot-option-btn"
                          onClick={() => handleSend(opt.title, true)}
                        >
                          {opt.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-message bot">
                <div className="chatbot-message-avatar">SB</div>
                <div className="chatbot-message-content">
                  <div className="chatbot-bubble chatbot-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-actions">
            <button onClick={handleReset}>В главное меню</button>
            <button onClick={handleSupport}>Поддержка</button>
            <button onClick={() => setMessages([])}>Очистить чат</button>
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder="Введите сообщение..."
            />
            <button onClick={() => handleSend(inputValue)} disabled={!inputValue.trim()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
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
