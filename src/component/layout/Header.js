import React, { Component } from 'react';
import * as actions from '../../action';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Gnb from './Gnb';

class Header extends Component {
    componentDidMount() {
        let language = this.props.language;

        axios.get(`/json/${language}/menuData.json`)
            .then(response => {
                this.props.loadMenu(response.data.data);
            });
    }
    render() {
        return(
            <header id="header" className={this.props.headerType}>
                <h1>
                    <Link to="/">
                        <span>M</span>
                        <span>J</span>
                        <span>P</span>
                        <span>F</span>
                    </Link>
                </h1>
                <button type="button" id="btnGnb">
                    <i>
                        <span></span>
                        <span></span>
                        <span></span>
                    </i>
                </button>
                <Gnb data={this.props.menuData}></Gnb>
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menuData: state.menuData,
        language: state.language,
        headerType: state.headerType
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadMenu: (data) => { dispatch(actions.loadMenu(data)); }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);