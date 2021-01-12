import React from 'react';

const SmallButton = ({color, action, img}) => {
    return (
        <div className={`small-button ${color}`} onClick={action}>
            <img src={img} alt="icon" />
        </div>
    )
};

export default SmallButton;