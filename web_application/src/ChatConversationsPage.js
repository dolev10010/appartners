import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import UserContext from './UserContext';
import './ChatConversationsPage.css';
import HeaderButtons from './HeaderButtons';
import Logo from './Logo';

function ChatConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://${config.serverPublicIP}:5433/get-conversations?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
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
