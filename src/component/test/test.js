import React, { Component } from 'react';
import { connect } from 'react-redux';
import { composeThemeFromProps } from '@css-modules-theme/react';
import styles from './test.module.scss';
import themeStyles from './test.theme.scss';
import * as actions from "../../action";
import TestChild from './testChild';

class Test extends Component {
    render() {
        const prefix = `${this.props.theme}-`;
        return(
            <div>
                <TestChild theme={themeStyles} themePrefix={prefix} themeCompose="merge"></TestChild>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        theme: state.theme
    }
};
export default connect(mapStateToProps)(Test);