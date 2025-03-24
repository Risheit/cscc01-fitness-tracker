import { WebSocketServer, WebSocket } from 'ws';

// Map to store WebSocket connections for each conversation
const conversationClients = new Map<number, Set<WebSocket>>();

const wss = new WebSocketServer({
  host: process.env.HOSTNAME,
  port: Number.parseInt(process.env.PORT),
});

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log(
      `Received message: ${data.content} for conversation: ${data.conversation_id}`
    );

    // Ensure the conversation_id is valid
    if (!data.conversation_id) {
      console.error('Invalid conversation_id:', data.conversation_id);
      return;
    }

    // Add the client to the conversation's set of clients
    if (!conversationClients.has(data.conversation_id)) {
      conversationClients.set(data.conversation_id, new Set());
    }
    conversationClients.get(data.conversation_id)?.add(ws);

    // Broadcast the message to all clients in the same conversation
    const clients = conversationClients.get(data.conversation_id);
    if (clients) {
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove the client from all conversations
    conversationClients.forEach((clients, conversation_id) => {
      if (clients.has(ws)) {
        clients.delete(ws);

        // Clean up empty conversation sets
        if (clients.size === 0) {
          conversationClients.delete(conversation_id);
        }
      }
    });
  });
});

console.log(`WebSocket server is running on ws://${process.env.HOSTNAME}:${process.env.PORT}`);
