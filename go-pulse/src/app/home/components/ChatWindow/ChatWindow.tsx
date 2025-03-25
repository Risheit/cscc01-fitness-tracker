'use client';

import { useEffect, useState, useRef } from 'react';
import Linkify from 'react-linkify';

type Message = {
  id: number;
  sender_id: number;
  conversation_id: number;
  content: string;
  created_at: string;
};

type Props = {
  conversationId: number;
  myUserId: number;
  otherUserUsername: string;
  wsUrl: string;
};

export default function ChatWindow({
  conversationId,
  myUserId,
  otherUserUsername,
  wsUrl
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const ws = useRef<WebSocket | null>(null);

  // Fetch initial messages
  useEffect(() => {
    if (conversationId) {
      fetch(`/api/conversations/${conversationId}/message`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data: Message[]) => setMessages(data))
        .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [conversationId]);

  // WebSocket connection
  useEffect(() => {
    if (!conversationId) return;

    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      ws.current?.close();
    };
  }, [conversationId, wsUrl]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`/api/conversations/${conversationId}/message`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, conversationId }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const savedMessage: Message = await res.json();

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(savedMessage));
        setMessages((prev) => [...prev, savedMessage]);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Custom link decorator
  const linkDecorator = (
    decoratedHref: string,
    decoratedText: string,
    key: number
  ) => (
    <a href={decoratedHref} key={key} className="text-blue-400 hover:underline">
      {decoratedText}
    </a>
  );

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-800 text-white rounded-lg shadow-md">
      {/* Chat Header */}
      <div className="bg-gray-700 p-4 text-white rounded-t-lg">
        <h2 className="text-xl font-semibold">{otherUserUsername}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === myUserId ? 'justify-end' : 'justify-start'
            }`}
            title={new Date(msg.created_at).toLocaleString()}
          >
            <div
              className={`max-w-[60%] p-3 rounded-lg text-sm ${
                msg.sender_id === myUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Linkify componentDecorator={linkDecorator}>{msg.content}</Linkify>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex p-4 border-t border-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
