import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Gnb extends Component {
    makeLi() {
        let li = [];
        let data = [
            {idx: '1', name:'MENU1'},
            {idx: '2', name:'MENU2'},
            {idx: '3', name:'MENU3'}
        ];

        data.forEach((v, i) => {
            li[i] = <li key={v.idx}><NavLink activeClassName="on" to={`/view/${v.idx}`}>{v.name}</NavLink></li>;
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