import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return(
            <header id="header">
                <h1><Link to="/">M.J.P.F</Link></h1>
            </header>
        );
    }
}
export default Header;