// Action Type
/*export const LOAD_MODE = 'LOAD_MODE'; // 현재 페이지 모드 - main, menu, view
export const LOAD_ID = 'LOAD_ID'; // 현재 페이지 아이디(이름) - 고유값
export const GET_DATA = 'GET_DATA'; // 현재 페이지 모드에 따라 axios로 가져온 데이터*/

export const LOAD_MAIN = 'LOAD_MAIN';
export const LOAD_MENU = 'LOAD_MENU';
export const LOAD_VIEW = 'LOAD_VIEW';
export const CHANGE_MAIN_STATUS = 'CHANGE_MAIN_STATUS';


// Action Creator
function makeActionCreator(type, ...argNames) {
    return function(...args) {
        let action = { type };
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index];
        });
        return action;
    }
}

/*
export const loadMode = makeActionCreator('LOAD_MODE', 'mode');
export const loadId = makeActionCreator('LOAD_ID', 'id');
export const getData = makeActionCreator('getData', 'data');*/

export const loadMain = makeActionCreator('LOAD_MAIN', 'data');
export const loadMenu = makeActionCreator('LOAD_MENU', 'id', 'data'); // 메뉴 활성화를 위해 현재 페이지 id 필요, 메뉴 data 관리
export const loadView = makeActionCreator('LOAD_VIEW', 'id', 'data');
export const changeMainStatus = makeActionCreator('CHANGE_MAIN_STATUS', 'mainStatus');
