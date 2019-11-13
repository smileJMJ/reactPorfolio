import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Gnb extends Component {
    makeLi() {
        let li = [];
        let data = [
            {id: '1', name:'MENU1'},
            {id: '2', name:'MENU2'},
            {id: '3', name:'MENU3'}
        ];

        data.forEach((v, i) => {
            li[i] = <li key={v.id}><NavLink activeClassName="on" to={`/view/${v.id}`}>{v.name}</NavLink></li>;
        });
        return li;
    }
    render() {
        return (
            <nav>
                <ul>
                    {this.makeLi()}
                </ul>
            </nav>
        )
    }
}

export default Gnb;