import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/app/providers/AuthProvider';
import type { Message } from '@/entities/message';

export function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get('user');
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(Number(selectedUserId));
    }
  }, [selectedUserId]);

  async function loadConversations() {
    try {
      const response = await apiClient.get('/messages');
      const msgs = response.data as Message[];
      
      const convMap = new Map();
      msgs.forEach((msg: Message) => {
        const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
        const otherUserName = msg.sender_id === user?.id ? msg.receiver_name : msg.sender_name;
        
        if (!convMap.has(otherUserId)) {
          convMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUserName,
            lastMessage: msg.body,
            lastMessageDate: msg.created_at,
            unread: !msg.read && msg.receiver_id === user?.id,
          });
        }
      });
      
      setConversations(Array.from(convMap.values()));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(userId: number) {
    try {
      const response = await apiClient.get(`/messages/thread/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);
    try {
      await apiClient.post('/messages', {
        receiver_id: Number(selectedUserId),
        subject: subject || 'Re: Conversation',
        body: newMessage,
      });
      
      setNewMessage('');
      setSubject('');
      loadMessages(Number(selectedUserId));
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-screen flex">
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No conversations yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <Link
                key={conv.userId}
                to={`/messages?user=${conv.userId}`}
                className={`block p-4 hover:bg-gray-50 transition-colors ${
                  selectedUserId === String(conv.userId) ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{conv.userName}</h3>
                  {conv.unread && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conv.lastMessageDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedUserId ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {conversations.find((c) => c.userId === Number(selectedUserId))?.userName || `User #${selectedUserId}`}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isSent = message.sender_id === user?.id;
                return (
                  <div key={message.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        isSent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                      } rounded-lg p-4`}
                    >
                      <p className="text-sm font-medium mb-1">{message.subject}</p>
                      <p className="text-sm">{message.body}</p>
                      <p className={`text-xs mt-2 ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="mb-3">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
