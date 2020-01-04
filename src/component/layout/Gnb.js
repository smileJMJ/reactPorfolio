import React, { Component } from 'react';
import * as actions from '../../action';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class Gnb extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.data !== nextProps.data) return true;
        return false;
    }
    componentDidMount() {
        /*let btnLanguage = document.getElementsByClassName('btnLanguage');
        let btnTheme = document.getElementsByClassName('btnTheme');*/

        let gnb = document.getElementById('gnb');
        gnb.addEventListener('click', (event) => {
            let target = event.target;
            if(target.type !== 'button') return;

            if(target.dataset.language) { // 언어 버튼 클릭 시
                this.props.changeLanguage(target.dataset.language);
            } else if(target.dataset.theme) { // 테마 버튼 클릭 시
                this.props.changeTheme(target.dataset.theme);
            }
        });
    }
    render() {
        return (
            <nav id="gnb">
                <div className="gnbInner">
                    <ul>
                        {
                            this.props.data.map((v, i) => {
                                return <li key={v.id}><NavLink activeClassName="on" to={`/view/${v.id}`}>{v.name}</NavLink></li>;
                            })
                        }
                        <li>
                            <button type="button" className="btnLanguage" data-language="kor">KOR</button>
                            <button type="button" className="btnLanguage" data-language="eng">ENG</button>
                        </li>
                        <li>
                            <button type="button" className="btnTheme" data-theme="dark">DARK</button>
                            <button type="button" className="btnTheme" data-theme="bright">BRIGHT</button>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguage: (language) => { dispatch(actions.changeLanguage(language)); },
        changeTheme: (theme) => { dispatch(actions.changeTheme(theme)); }
    }
};

export default connect(null, mapDispatchToProps)(Gnb);