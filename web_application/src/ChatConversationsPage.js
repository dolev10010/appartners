import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import io from 'socket.io-client';
import UserContext from './UserContext';
import './ChatConversationsPage.css';
import HeaderButtons from './HeaderButtons';
import Logo from './Logo';

const socket = io(`http://${config.serverPublicIP}:5433`);

function ChatConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);

  // Load cached conversations from localStorage on initial render
  useEffect(() => {
    const cachedConversations = JSON.parse(localStorage.getItem(`conversations-${userEmail}`));
    if (cachedConversations) {
      setConversations(cachedConversations);
      const cachedUnreadCount = cachedConversations.reduce((count, conv) => count + conv.unread_count, 0);
      setTotalUnreadCount(cachedUnreadCount);
    }

    // Fetch new conversations from the server
    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://${config.serverPublicIP}:5433/get-conversations?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();

          // Cache the updated conversations in localStorage
          localStorage.setItem(`conversations-${userEmail}`, JSON.stringify(data.conversations));
          setConversations(data.conversations);
          setTotalUnreadCount(data.total_unread_count);
        } else {
          console.error('Failed to fetch conversations');
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();

    // Listen for real-time messages via socket.io
    socket.emit('join', { email: userEmail });

    socket.on('receive_message', (message) => {
      if (message.receiver === userEmail) {
        setConversations((prevConversations) => {
          // Update the conversation list with the new message
          const updatedConversations = prevConversations.map((conv) => {
            if (conv.email === message.sender) {
              return {
                ...conv,
                last_message: message.message,
                last_timestamp: message.timestamp,
                unread_count: conv.unread_count + 1, // Increment unread count
              };
            }
            return conv;
          });

          // Add new conversation if it doesn't exist in the list
          if (!updatedConversations.some((conv) => conv.email === message.sender)) {
            updatedConversations.push({
              email: message.sender,
              full_name: `${message.sender_name}`,
              photo_url: message.sender_image || '', // Provide a fallback in case image is missing
              last_message: message.message,
              last_timestamp: message.timestamp,
              unread_count: 1, // New conversation, so set unread to 1
            });
          }

          // Cache the updated conversation list
          localStorage.setItem(`conversations-${userEmail}`, JSON.stringify(updatedConversations));

          return updatedConversations;
        });

        // Update the total unread count
        setTotalUnreadCount((prevUnreadCount) => prevUnreadCount + 1);
      }
    });

    return () => {
      socket.emit('leave', { email: userEmail });
      socket.off('receive_message');
    };
  }, [userEmail]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationClick = async (receiverEmail, fullName, photoUrl) => {
    try {
      // Fetch all messages between the sender and receiver directly via HTTP request
      await fetch(`http://${config.serverPublicIP}:5433/get-messages?sender=${userEmail}&receiver=${receiverEmail}`);
      navigate(`/chat/${receiverEmail}`, {
        state: {
          first_name: fullName.split(" ")[0],
          last_name: fullName.split(" ")[1],
          photo_url: photoUrl
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { dateString, timeString };
  };

  return (
    <div className="chat-conversations-page">
      <header className="chat-header">
        <div className="logo-chat-container">
          <Logo />
          <h2 className="chat-title">Chat</h2>
        </div>
        <HeaderButtons badgeContent={totalUnreadCount} />
      </header>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="🔍Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <ul className="conversations-list">
        {filteredConversations.map(conversation => {
          const { dateString, timeString } = formatDate(conversation.last_timestamp);
          const conversationClass = conversation.unread_count > 0 ? "conversation-item unread" : "conversation-item";

          return (
            <li
              key={conversation.email}
              onClick={() => handleConversationClick(conversation.email, conversation.full_name, conversation.photo_url)}
              className={conversationClass}
            >
              <img src={conversation.photo_url} alt={conversation.full_name} className="conversation-image" />
              <div className="conversation-details">
                <p className="conversation-name">{conversation.full_name}</p>
                <p className="conversation-last-message">{conversation.last_message}</p>
              </div>
              <div className="conversation-meta">
                <span className="conversation-date">{dateString}</span>
                <span className="conversation-time">{timeString}</span>
                {conversation.unread_count > 0 && (
                  <div className="unread-badge">{conversation.unread_count}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ChatConversationsPage;
