import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { io, Socket } from 'socket.io-client';
import Avatar from '../../components/ui/Avatar';
import { useSocket } from '../../hooks/useSocket';
import { useParams, useNavigate } from 'react-router-dom';
import ChatBox from '../../components/messages/ChatBox';
import { FaPlus } from 'react-icons/fa';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if needed

// Message type
interface Message {
  _id: string;
  text: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  createdAt: string;
  senderName?: string;
  senderImage?: string;
}

interface UserInfo {
  _id: string;
  name: string;
  profileImage?: string;
}

const MessagesPage: React.FC = () => {
  const { listingId, receiverId } = useParams<{ listingId: string; receiverId: string }>();
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});
  const [conversations, setConversations] = useState<{ listingId: string; receiverId: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage } = useSocket((msg) => {
    setMessages((prev) => [...prev, msg]);
  });
  const navigate = useNavigate();

  // Add state for new chat modal
  const [showNewChat, setShowNewChat] = useState(false);
  const [newListingId, setNewListingId] = useState('');
  const [newReceiverId, setNewReceiverId] = useState('');
  const [allListings, setAllListings] = useState<{ _id: string; title: string }[]>([]);
  const [allUsers, setAllUsers] = useState<{ _id: string; username?: string; name?: string; email?: string }[]>([]);

  // Fetch all conversations for the user
  useEffect(() => {
    if (!user || !token) return;
    fetch('/api/messages', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then((msgs: Message[]) => {
        const convMap: Record<string, { listingId: string; receiverId: string; name: string }> = {};
        msgs.forEach(m => {
          // For each message, if the logged-in user is either sender or receiver, the other party is the conversation partner
          if (m.senderId === user.id || m.receiverId === user.id) {
            const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
            const convKey = `${m.listingId}_${otherId}`;
            if (!convMap[convKey]) {
              convMap[convKey] = { listingId: m.listingId, receiverId: otherId, name: otherId };
            }
          }
        });
        // Optimistically add current chat if not present
        if (listingId && receiverId) {
          const convKey = `${listingId}_${receiverId}`;
          if (!convMap[convKey]) {
            convMap[convKey] = { listingId, receiverId, name: receiverId };
          }
        }
        setConversations(Object.values(convMap));
      });
  }, [user, token, listingId, receiverId]);

  // Fetch messages for this listing
  useEffect(() => {
    if (!listingId || !token) return;
    fetch(`/api/messages/${listingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(async (msgs: Message[]) => {
        // Show all messages between the logged-in user and the selected user for this listing
        let filtered = msgs;
        if (receiverId && user) {
          filtered = msgs.filter(m =>
            (m.senderId === user.id && m.receiverId === receiverId) ||
            (m.senderId === receiverId && m.receiverId === user.id)
          );
        }
        setMessages(filtered);
        // Fetch user info for avatars/names
        const userIds = Array.from(new Set(filtered.flatMap(m => [m.senderId, m.receiverId])));
        const userInfoMap: Record<string, UserInfo> = {};
        await Promise.all(userIds.map(async (id) => {
          if (!userMap[id]) {
            const res = await fetch(`/api/users/${id}`);
            if (res.ok) {
              const u = await res.json();
              userInfoMap[id] = { _id: u._id, name: u.username || u.name, profileImage: u.profileImage };
            }
          }
        }));
        setUserMap(prev => ({ ...prev, ...userInfoMap }));
      });
  }, [listingId, token, receiverId, user, userMap]);

  // Setup socket connection (only once on mount)
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('receiveMessage', (msg: Message) => {
      if (msg.listingId === listingId) {
        setMessages((prev) => [...prev, msg]);
        // Fetch sender info if not present
        if (!userMap[msg.senderId]) {
          fetch(`/api/users/${msg.senderId}`)
            .then(res => res.json())
            .then(u => setUserMap(prev => ({ ...prev, [msg.senderId]: { _id: u._id, name: u.username || u.name, profileImage: u.profileImage } })));
        }
      }
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [listingId, userMap]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a new message
  const sendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!text.trim() || !listingId || !receiverId) return;
    try {
      const res = await fetch(`/api/messages/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text, receiverId, listingId }) // include listingId explicitly
      });
      if (!res.ok) {
        const errMsg = await res.text();
        setError(`Failed to send: ${res.status} ${errMsg}`);
        console.error('Send message error:', res.status, errMsg);
        return;
      }
      const newMsg: Message = await res.json();
      setMessages(prev => [...prev, newMsg]);
      setText('');
      sendMessage(newMsg);
      setConversations(prev => {
        if (!prev.find(c => c.listingId === listingId && c.receiverId === receiverId)) {
          const name = receiverId && userMap[receiverId]?.name ? userMap[receiverId].name : (receiverId || '');
          return [...prev, { listingId, receiverId: receiverId || '', name }];
        }
        return prev;
      });
    } catch (err) {
      setError('Network or server error.');
      console.error('Send message exception:', err);
    }
  };

  // Conversation list UI
  const renderConversationList = () => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2 text-white">Your Conversations</h2>
      {conversations.length === 0 ? (
        <div className="text-gray-400">No conversations yet.</div>
      ) : (
        <ul className="space-y-2">
          {conversations.map(conv => (
            <li key={`${conv.listingId}_${conv.receiverId}`}
                className="cursor-pointer hover:bg-gray-700 rounded px-2 py-1"
                onClick={() => navigate(`/messages/${conv.listingId}/${conv.receiverId}`)}>
              <span className="font-semibold text-white">Listing:</span> {conv.listingId.slice(-6)}
              <span className="ml-2 font-semibold text-white">User:</span> {conv.receiverId.slice(-6)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Fetch all listings and users for new chat modal
  useEffect(() => {
    if (showNewChat) {
      fetch('/api/listings').then(res => res.json()).then(setAllListings);
      fetch('/api/users').then(res => res.json()).then(setAllUsers);
    }
  }, [showNewChat]);

  // Show prompt if params are missing or invalid
  if (!listingId || !receiverId || listingId === 'undefined' || receiverId === 'undefined') {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#312e81]">
        <div className="w-full max-w-xl bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-md">
          {renderConversationList()}
        </div>
        <div className="text-red-500 font-bold mb-2">Debug: listingId={String(listingId)}, receiverId={String(receiverId)}</div>
        <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Select a conversation to start chatting</h2>
        <p className="text-gray-300">No chat selected. Please choose a listing and user to start messaging.</p>
        <div className="mt-8">
          <span className="text-lg text-white font-semibold">Or start a new conversation from a listing page!</span>
        </div>
      </div>
    );
  }

  // --- OLX-style UI ---
  if (listingId && receiverId) {
    // Find current conversation/listing info
    const currentConv = conversations.find(c => c.listingId === listingId && c.receiverId === receiverId);
    const listing = allListings.find(l => l._id === listingId);
    const userInfo = userMap[receiverId] || {};
    const listingTitle = listing?.title || 'Listing';
    // For demo, fake price/details
    const price = '₹ 1,000';
    const details = 'Sample details';
    // Last message preview for sidebar
    const getLastMessage = (conv) => {
      const msgs = messages.filter(m => m.listingId === conv.listingId && (m.senderId === conv.receiverId || m.receiverId === conv.receiverId));
      return msgs.length > 0 ? msgs[msgs.length - 1].text : 'No messages yet.';
    };
    return (
      <div className="flex h-[80vh] max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border">
        {/* Sidebar: Inbox */}
        <aside className="w-1/3 bg-gray-50 border-r flex flex-col">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold mb-2">INBOX</h2>
            {/* Quick Filters */}
            <div className="flex gap-2 mb-2">
              <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">All</button>
              <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs">Meeting</button>
              <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs">Unread</button>
              <button className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs">Important</button>
            </div>
          </div>
          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-gray-400 p-6">No conversations yet.</div>
            ) : (
              <ul>
                {conversations.map(conv => {
                  const isActive = conv.listingId === listingId && conv.receiverId === receiverId;
                  const l = allListings.find(l => l._id === conv.listingId);
                  return (
                    <li
                      key={`${conv.listingId}_${conv.receiverId}`}
                      className={`flex items-center gap-3 px-6 py-4 cursor-pointer border-b hover:bg-blue-50 transition ${isActive ? 'bg-blue-100' : ''}`}
                      onClick={() => navigate(`/messages/${conv.listingId}/${conv.receiverId}`)}
                    >
                      <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                        {/* Listing image placeholder */}
                        <span className="text-2xl">🏠</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{l?.title || 'Listing'}</div>
                        <div className="text-xs text-gray-500 truncate">{getLastMessage(conv)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
        {/* Chat Panel */}
        <section className="flex-1 flex flex-col bg-white">
          {/* Chat header with listing details */}
          <div className="flex items-center gap-4 px-6 py-4 border-b bg-gray-50">
            <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">🏠</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg truncate">{listingTitle}</div>
              <div className="text-xs text-gray-500 truncate">{price} &nbsp;|&nbsp; {details}</div>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">No messages yet. Start the conversation!</div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((msg, idx) => (
                  <div key={msg._id || idx} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-[70%] text-sm shadow ${msg.senderId === user?.id ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
          {/* Quick Questions (static) */}
          <div className="border-t bg-gray-50 px-6 py-2">
            <div className="flex gap-2 flex-wrap text-xs mb-2">
              <button className="bg-gray-200 px-3 py-1 rounded-full">Is it still available?</button>
              <button className="bg-gray-200 px-3 py-1 rounded-full">Let's meet up?</button>
              <button className="bg-gray-200 px-3 py-1 rounded-full">What is the current location?</button>
              <button className="bg-gray-200 px-3 py-1 rounded-full">Can you share more pictures?</button>
            </div>
          </div>
          {/* Message input */}
          <form onSubmit={sendNewMessage} className="flex items-center gap-2 px-6 py-4 border-t bg-white">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition">Send</button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] max-w-5xl mx-auto bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/3 bg-gradient-to-b from-[#232526] to-[#414345] border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-[#232526] to-[#414345] flex items-center justify-between">
          <h2 className="text-lg font-bold mb-2 text-white tracking-wide">Chats</h2>
          <button
            className="ml-2 p-2 rounded-full bg-primary text-white hover:bg-primary/80 transition"
            title="Start New Conversation"
            onClick={() => setShowNewChat(true)}
          >
            <FaPlus />
          </button>
        </div>
        {/* New Chat Modal */}
        {showNewChat && (
          <div className="absolute z-50 left-0 top-0 w-full h-full flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Start New Conversation</h3>
              <div className="mb-4">
                <label className="block text-white mb-1">Listing</label>
                <select
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={newListingId}
                  onChange={e => setNewListingId(e.target.value)}
                >
                  <option value="">Select a listing</option>
                  {allListings.map(l => (
                    <option key={l._id} value={l._id}>{l.title}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-white mb-1">User</label>
                <select
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  value={newReceiverId}
                  onChange={e => setNewReceiverId(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {allUsers.filter(u => u._id !== user?.id).map(u => (
                    <option key={u._id} value={u._id}>{u.username || u.name || u.email}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 rounded bg-gray-700 text-white" onClick={() => setShowNewChat(false)}>Cancel</button>
                <button
                  className="px-4 py-2 rounded bg-primary text-white font-bold disabled:opacity-50"
                  disabled={!newListingId || !newReceiverId}
                  onClick={() => {
                    setShowNewChat(false);
                    navigate(`/messages/${newListingId}/${newReceiverId}`);
                  }}
                >Start</button>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-[#232526] to-[#414345]">
          <h2 className="text-lg font-bold mb-2 text-white tracking-wide">Chats</h2>
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-[#232526] text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="text-gray-400 p-4">No conversations yet.</div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {conversations.map(conv => {
                const isActive = conv.listingId === listingId && conv.receiverId === receiverId;
                const userInfo = userMap[conv.receiverId];
                return (
                  <li
                    key={`${conv.listingId}_${conv.receiverId}`}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all duration-150 rounded-lg ${isActive ? 'bg-primary/30' : ''}`}
                    onClick={() => navigate(`/messages/${conv.listingId}/${conv.receiverId}`)}
                  >
                    <Avatar src={userInfo?.profileImage} alt={userInfo?.name} size="md" />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{userInfo?.name || conv.receiverId.slice(-6)}</div>
                      <div className="text-xs text-gray-400 truncate">Listing: {conv.listingId.slice(-6)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
      {/* Chat panel */}
      <section className="flex-1 flex flex-col bg-gradient-to-br from-[#232526] via-[#232526] to-[#232526]">
        {/* Chat header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-[#232526] to-[#414345]">
          {/* Listing image placeholder */}
          <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
            <span className="text-gray-400 text-xl">🏠</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-white tracking-wide">{userMap[receiverId || '']?.name || 'User'}</div>
            <div className="text-sm text-gray-400">Listing: {listingId?.slice(-6)}</div>
          </div>
          {/* Actions */}
          <div className="flex gap-3">
            <button className="text-gray-400 hover:text-primary transition-transform hover:scale-110"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 6.5a2.5 2.5 0 0 0-5 0V7h-8v-.5a2.5 2.5 0 0 0-5 0v11a2.5 2.5 0 0 0 5 0V17h8v.5a2.5 2.5 0 0 0 5 0v-11Z" stroke="currentColor" strokeWidth="2"/></svg></button>
            <button className="text-gray-400 hover:text-primary transition-transform hover:scale-110"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M17 10.5V7a5 5 0 0 0-10 0v3.5" stroke="currentColor" strokeWidth="2"/></svg></button>
          </div>
        </div>
        {/* ChatBox for chat UI and send button */}
        <ChatBox
          messages={messages}
          user={user}
          userMap={userMap}
          text={text}
          setText={setText}
          error={error}
          onSend={sendNewMessage}
          chatEndRef={chatEndRef}
        />
      </section>
    </div>
  );
};

export default MessagesPage;