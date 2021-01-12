import React from 'react';

const Step = ({digit, text, color}) => {
    return (
        <div className="main-card__steps--step">
            <div className={`span-container ${color && color}`}>
                <span>{digit}</span>
            </div>
            <div className="text-container">
                <p>{text}</p>
            </div>
        </div>
    )
};

export default Step;