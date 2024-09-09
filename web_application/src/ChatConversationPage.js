import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import config from './config.json';
import io from 'socket.io-client';
import UserContext from './UserContext';
import HeaderButtons from './HeaderButtons';
import './ChatConversationPage.css';

const socket = io(`http://${config.serverPublicIP}:5433`);

function ChatConversationPage() {
  const { receiverEmail } = useParams();
  const { userEmail } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { state } = useLocation(); // Access the state passed from ChatConversationsPage
  const navigate = useNavigate();

  const markMessagesAsRead = async () => {
    try {
      await fetch(`http://${config.serverPublicIP}:5433/mark-messages-as-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: receiverEmail, receiver: userEmail }),
      });
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const fetchMessagesAndMarkRead = async () => {
    const cachedMessages = JSON.parse(localStorage.getItem(`messages-${userEmail}-${receiverEmail}`));

    if (cachedMessages) {
      setMessages(cachedMessages);
    }

    try {
      const response = await fetch(
        `http://${config.serverPublicIP}:5433/get-messages?sender=${userEmail}&receiver=${receiverEmail}`
      );
      if (response.ok) {
        const data = await response.json();
        const uniqueMessages = Array.from(new Set(data.map((msg) => msg[3]))).map((timestamp) =>
          data.find((msg) => msg[3] === timestamp)
        );

        setMessages(uniqueMessages);

        // Cache updated messages
        localStorage.setItem(`messages-${userEmail}-${receiverEmail}`, JSON.stringify(uniqueMessages));

        // Mark all messages as read after fetching
        await markMessagesAsRead();
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessagesAndMarkRead();

    socket.emit('join', { email: userEmail });

    socket.on('receive_message', (message) => {
      if (message.sender === receiverEmail || message.receiver === userEmail) {
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg[3] === message.timestamp)) {
            return prevMessages;
          }

          const updatedMessages = [...prevMessages, [message.sender, message.receiver, message.message, message.timestamp]];

          // Cache updated messages
          localStorage.setItem(`messages-${userEmail}-${receiverEmail}`, JSON.stringify(updatedMessages));

          return updatedMessages;
        });

        // Immediately mark the new message as read when it arrives
        if (message.receiver === userEmail && message.sender === receiverEmail) {
          markMessagesAsRead();
        }
      }
    });

    return () => {
      socket.emit('leave', { email: userEmail });
      socket.off('receive_message');
    };
  }, [receiverEmail, userEmail]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const timestamp = new Date().toISOString();
    const message = {
      sender: userEmail,
      receiver: receiverEmail,
      message: newMessage,
      timestamp,
      sender_name: state?.first_name + ' ' + state?.last_name, // Include sender's name
      sender_image: state?.photo_url, // Include sender's profile image
    };

    // Emit the message through the socket
    socket.emit('send_message', message);

    setNewMessage('');

    // Add the message to the state immediately
    setMessages((prevMessages) => {
      const updatedMessages = [
        ...prevMessages,
        [message.sender, message.receiver, message.message, message.timestamp, message.sender_name, message.sender_image],
      ];

      // Cache updated messages
      localStorage.setItem(`messages-${userEmail}-${receiverEmail}`, JSON.stringify(updatedMessages));

      return updatedMessages;
    });

    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderDateSeparator = (currentDate, previousDate) => {
    if (currentDate !== previousDate) {
      return (
        <div className="date-separator" key={`separator-${currentDate}`}>
          <span>{currentDate}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chat-conversation-page">
      <header className="chat-header">
        <HeaderButtons className="header-button" />
        <div className="profile-container">
          <img
            src={state.photo_url} // Use the photo_url passed via state
            alt={`${state.first_name} ${state.last_name}`} // Use the first_name and last_name passed via state
            className="profile-image"
            onClick={() => navigate(`/profile/${receiverEmail}`)}
          />
          <h2 className="profile-name">{`${state.first_name} ${state.last_name}`}</h2>
        </div>
      </header>
      <div className="messages-list">
        {messages.map((message, index) => {
          const currentMessageDate = formatDate(message[3]);
          const previousMessageDate = index > 0 ? formatDate(messages[index - 1][3]) : null;

          return (
            <React.Fragment key={`${message[3]}-${index}`}>
              {renderDateSeparator(currentMessageDate, previousMessageDate)}
              <div className={`message-item ${message[0] === userEmail ? 'sent' : 'received'}`}>
                <p className="message-text">
                  {message[2].split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <span className="message-time">{formatTime(message[3])}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="message-input-container">
        <textarea
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="message-input"
          rows={1}
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatConversationPage;
