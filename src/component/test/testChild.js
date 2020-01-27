import React, { Component } from 'react';
import { connect } from 'react-redux';
import { composeThemeFromProps } from '@css-modules-theme/react';
import styles from './test.module.scss';
import themeStyles from './test.theme.scss';
import * as actions from "../../action";

class TestChild extends Component {
    changeTheme(t) {
        //t === 'dark' ? 'bright' : 'dark'
        const theme = composeThemeFromProps(styles, t, {compose: 'replace'});
        console.log(theme);
        this.props.changeTheme(theme);
    }
    render() {
        const theme = composeThemeFromProps(styles, this.props, {compose: 'replace'});
        console.log(this.props)
        return(
            <>
                <button className={theme} onClick={() => {this.changeTheme(this.props);}}>버튼</button>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        changeTheme: (theme) => { dispatch(actions.changeTheme(theme)); }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TestChild);