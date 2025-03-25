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

type ChatWindowProps = {
  conversationId: number;
  myUserId: number;
  otherUserUsername: string;
};

export default function ChatWindow({
  conversationId,
  myUserId,
  otherUserUsername,
}: ChatWindowProps) {
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
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: Message[]) => {
          setMessages(data);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [conversationId]);

  // Establish WebSocket connection
  useEffect(() => {
    if (!conversationId) return;

    // Connect to the WebSocket server
    ws.current = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}`
    );

    // Handle incoming messages
    ws.current.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    // Handle connection close
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Handle connection errors
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`/api/conversations/${conversationId}/message`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          conversationId: conversationId,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Parse the response to get the saved message
      const savedMessage: Message = await res.json();

      // Send the saved message to the WebSocket server
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(savedMessage));
        setMessages((prev) => [...prev, savedMessage]);
      } else {
        console.error('WebSocket connection not established');
      }

      // Clear the input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to the bottom of the chat window when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Custom link decorator to apply the CSS class
  const linkDecorator = (
    decoratedHref: string,
    decoratedText: string,
    key: number
  ) => (
    <a href={decoratedHref} key={key} className="linkify-link">
      {decoratedText}
    </a>
  );

  return (
    <div className="flex flex-col flex-1 h-full border rounded-lg">
      {/* Header with Other User's Name */}
      <div className="bg-blue-100 p-4 text-black rounded-t-lg">
        <h2 className="text-xl font-bold">{otherUserUsername}</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === myUserId ? 'justify-end' : 'justify-start'
            } mb-2`}
            title={`${new Date(msg.created_at).toLocaleString()}`}
          >
            <div
              className={`max-w-[60%] p-3 rounded-lg ${
                msg.sender_id === myUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              <Linkify componentDecorator={linkDecorator}>
                <div className="text-sm">{msg.content}</div>
              </Linkify>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />{' '}
        {/* Empty div for scrolling to the bottom */}
      </div>

      {/* Message Input */}
      <div className="flex p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
