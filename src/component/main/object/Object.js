import React from 'react';
import styles from './object.module.css';

export const textBalloon = function(option) { // 말풍선
    return <div className="textBalloon" data-status={option.status}>{option.contents}</div>;
}

export const ground = function(option) { // 땅
    return <div className={styles.ground} data-status={option.status}></div>;
}