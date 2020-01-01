// Action Type
export const LOAD_MAIN = 'LOAD_MAIN';
export const LOAD_MENU = 'LOAD_MENU';
export const LOAD_VISUAL = 'LOAD_VISUAL';
export const LOAD_LIST = 'LOAD_LIST';
export const LOAD_VIEW = 'LOAD_VIEW';
export const CHANGE_MAIN_STATUS = 'CHANGE_MAIN_STATUS';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const CHANGE_HEADER_TYPE = 'CHANGE_HEADER_TYPE';


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

export const loadMain = makeActionCreator('LOAD_MAIN', 'data');
export const loadMenu = makeActionCreator('LOAD_MENU', 'data');
export const loadVisual = makeActionCreator('LOAD_VISUAL', 'data');
export const loadList = makeActionCreator('LOAD_LIST', 'data');
export const loadView = makeActionCreator('LOAD_VIEW', 'id', 'data');
export const changeMainStatus = makeActionCreator('CHANGE_MAIN_STATUS', 'mainStatus');
export const changeLanguage = makeActionCreator('CHANGE_LANGUAGE', 'language');
export const changeHeaderType = makeActionCreator('CHANGE_HEADER_TYPE', 'headerType');
