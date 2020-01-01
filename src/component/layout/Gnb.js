import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Gnb extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.data !== nextProps.data) return true;
        return false;
    }
    render() {
        return (
            <nav id="Gnb">
                <ul>
                    {
                        this.props.data.map((v, i) => {
                            return <li key={v.id}><NavLink activeClassName="on" to={`/view/${v.id}`}>{v.name}</NavLink></li>;
                        })
                    }
                </ul>
            </nav>
        )
    }
}

export default Gnb;