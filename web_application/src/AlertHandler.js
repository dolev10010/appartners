import React from 'react';
import './AlertHandler.css';

function AlertHandler({ isOpen, message, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="alertHandlerOverlay">
            <div className="alertHandlerContent">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default AlertHandler;
