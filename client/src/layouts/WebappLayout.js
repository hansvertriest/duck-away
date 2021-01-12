import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Importing images
import Background from '../assets/background.svg';
import Logo from '../assets/logo.svg';

// Importing routes
import * as routes from '../routes';

const WebappLayout = ({children}) => {
    const token = localStorage.getItem('token');
    const history = useHistory();

    useEffect(() => {
        if (!token) {
            // history.push(routes.WHOOPS);
        };
    });

    return (
        <div className="app"
            style={{
                backgroundImage: `url(${Background})`
            }}
        >
            <div className="logo">
                <img src={Logo} alt="logo" />
            </div>
            { children }
        </div>
    )
};

export default WebappLayout;