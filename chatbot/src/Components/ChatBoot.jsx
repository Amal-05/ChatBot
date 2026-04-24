import React, { useState, useEffect, useRef } from 'react';
import './chatboot.css';
import Axios from '../axios/Axios';

function ChatBoot() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! I am Professor, the NSS Polytechnic College Assistant. How can I help you today? What is your name?', avatar: '' },
  ]);
  const [botAvatar, setBotAvatar] = useState('/bot-avatar.png');
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, categories, questions]);

  // Fetch the bot avatar
  useEffect(() => {
    const fetchBotAvatar = async () => {
      try {
        const response = await Axios.get('/get-avatar');
        if (response.data?.imageUrl) {
          setBotAvatar(response.data.imageUrl);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === 'bot' ? { ...msg, avatar: response.data.imageUrl } : msg
            )
          );
        }
      } catch (error) {
        console.error('Error fetching bot avatar:', error);
      }
    };
    fetchBotAvatar();
  }, []);

  // Fetch categories when a name is set
  useEffect(() => {
    if (!name) return;
    const fetchCategories = async () => {
      try {
        setIsTyping(true);
        const response = await Axios.get('/get-allCategory');
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        }
        setIsTyping(false);
      } catch (error) {
        setIsTyping(false);
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [name]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userText = newMessage;
    setNewMessage('');
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: userText,
        avatar: 'https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png',
      },
    ]);

    if (!name) {
      setName(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Nice to meet you, ${userText}! You can select a category below or ask me any question directly.`,
          avatar: botAvatar,
        },
      ]);
    } else {
      setIsTyping(true);
      try {
        const response = await Axios.post('/get-webisteQueston', { question: userText });
        const answerText = response.data?.answer || response.data || 'I am not sure how to answer that.';
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: answerText,
            avatar: botAvatar,
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'Sorry, I couldn’t process your question.',
            avatar: botAvatar,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleCategoryClick = async (category) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: `I'd like to explore: ${category.name}`,
        avatar: 'https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png',
      },
    ]);
    
    // Don't clear categories here, so we can return to them
    
    try {
      setIsTyping(true);
      const response = await Axios.get(`/get-categoryBasedQuestion/${category.name}`);
      setQuestions(response.data);
      setIsTyping(false);
    } catch (error) {
      setIsTyping(false);
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (question) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: question.question,
        avatar: 'https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png',
      },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: question.answer,
        avatar: botAvatar,
      },
    ]);
    setQuestions([]); // Hide questions after selection
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="header-info">
          <img src={botAvatar} alt="bot-avatar" className="header-avatar" />
          <div>
            <h2>College Assistant</h2>
            <span className="status">Online</span>
          </div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'bot' && <img src={msg.avatar} alt="bot" className="avatar" />}
            <div className="message-content">
              <div className="message-text">{msg.text}</div>
            </div>
            {msg.sender === 'user' && <img src={msg.avatar} alt="user" className="avatar" />}
          </div>
        ))}

        {isTyping && (
          <div className="chat-message bot">
            <img src={botAvatar} alt="bot" className="avatar" />
            <div className="message-content">
              <div className="message-text typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        {categories.length > 0 && questions.length === 0 && (
          <div className="quick-replies-container">
            <p className="quick-replies-title">Select a Category:</p>
            <div className="quick-replies">
              {categories.map((category) => (
                <button
                  key={category._id || category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="quick-reply-btn"
                >
                  {category.name}
                  {category.Subname && <span className="subname-badge">{category.Subname}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {questions.length > 0 && (
          <div className="quick-replies-container">
            <p className="quick-replies-title">Available Topics:</p>
            <div className="quick-replies">
              <button 
                className="quick-reply-btn" 
                style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}
                onClick={() => setQuestions([])}
              >
                ⬅ Back to Categories
              </button>
              {questions.map((question) => (
                <button
                  key={question._id || question.id}
                  onClick={() => handleAnswer(question)}
                  className="quick-reply-btn"
                >
                  {question.question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-footer">
        <div className="chat-input-wrapper">
          <input
            type="text"
            placeholder={name ? "Type your message or ask a question..." : "Enter your name..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
      <div className="chat-credit" style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', padding: '8px 0', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        Made by Amal
      </div>
    </div>
  );
}

export default ChatBoot;
