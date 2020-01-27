import React, { Component } from 'react';
import { connect } from 'react-redux';
import { composeThemeFromProps } from '@css-modules-theme/react';
import styles from './test.module.scss';
import * as actions from "../../action";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: props.theme
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(nextProps, prevState);
        return null;
    }
    changeTheme(t) {
        let theme = t === 'dark' ? 'bright' : 'dark';
        this.props.changeTheme(theme);
    }
    render() {
        return(
            <div>
                <button className={styles.button} onClick={() => {this.changeTheme(this.props.theme);}}>버튼</button>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Test);