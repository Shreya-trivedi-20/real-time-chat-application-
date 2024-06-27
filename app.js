import React, { useState, useEffect, useContext, createContext } from 'react';
import './App.css';

// Context for managing messages
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = (message) => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => socket.send(message);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

const Chat = () => {
  const { messages, sendMessage } = useContext(ChatContext);
  const [input, setInput] = useState('');

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <h1>Real-time Chat Application</h1>
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;
