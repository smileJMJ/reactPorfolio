import React, { Component } from 'react';
import * as actions from '../../action';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from "axios";

class Gnb extends Component {
    componentDidMount() {
        let root = document.getElementById('root');
        let gnb = document.getElementById('gnb');

        this.getData(this.props.language);

        gnb.addEventListener('click', (event) => {
            let target = event.target;
            if(target.type !== 'button') return;

            if(target.dataset.language) { // 언어 버튼 클릭 시
                this.props.changeLanguage(target.dataset.language);
                this.getData(target.dataset.language);
            } else if(target.dataset.theme) { // 테마 버튼 클릭 시
                root.dataset.theme = target.dataset.theme;
                this.props.changeTheme(target.dataset.theme);
            }
        });
    }
    getData(language) {
        // visual Data
        axios.get(`/json/${language}/visualData.json`)
            .then(response => {
                this.props.loadVisual(response.data.data);
            });

        // list Data
        axios.get(`/json/${language}/listData.json`)
            .then(response => {
                this.props.loadList(response.data.data);
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

const mapStateToProps = (state) => {
    return {
        visualData: state.visualData,
        listData: state.listData,
        language: state.language,
        theme: state.theme
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguage: (language) => { dispatch(actions.changeLanguage(language)); },
        changeTheme: (theme) => { dispatch(actions.changeTheme(theme)); },
        loadVisual: (data) => { dispatch(actions.loadVisual(data)); },
        loadList: (data) => { dispatch(actions.loadList(data)); }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Gnb);