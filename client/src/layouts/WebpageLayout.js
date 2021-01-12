import React from 'react';

import Logo from '../assets/logo.svg';

const WebpageLayout = ({children}) => {
    return (
        <div className="webpage">
            <header>
                <div></div>
                <nav><a href="/"><img src={Logo} alt="logo" /></a></nav>
            </header>
            {children}
            <footer>
                <a href="/"><img src={Logo} alt="logo" /></a>
            </footer>
        </div>
    )
};

export default WebpageLayout;