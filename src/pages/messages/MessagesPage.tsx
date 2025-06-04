import React, { useEffect, useState } from 'react';

const MessagesPage = () => {
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesPage;