import React from 'react';
import './AlertHandler.css';

function AlertHandler({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    // Split the message by newline characters and create elements for rendering
    const messageLines = message.split('\n').map((line, index, array) => (
        // Add <br /> after each line except the last one
        <React.Fragment key={index}>
            {line}
            {index < array.length - 1 && <br />}
        </React.Fragment>
    ));

    return (
        <div className="alertHandlerOverlay">
            <div className="alertHandlerContent">
                <p>{messageLines}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default AlertHandler;
