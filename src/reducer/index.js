import * as actions from '../action';

const initalState = {
    id: '', // view 페이지 이름
    visualData: [], // 리스트의 visual 데이터
    listData: [], // 리스트 데이터
    viewData: {}, // View 데이터
    menuData: [], // 메뉴 데이터
    mainStatus: 'start', // 메인 상태(start, website, websolution, end)
    language: 'kor', // 언어
    headerType: 'black', // 헤더 타입 (black, white)
    theme: 'dark' // 테마 - dark / light
};

export default function reducer(state = initalState, action) {
    switch(action.type) {
        case 'LOAD_MAIN':
            return {...state, listData: action.data};
        case 'LOAD_MENU':
            return {...state, menuData: action.data};
        case 'LOAD_VISUAL':
            return {...state, visualData: action.data};
        case 'LOAD_LIST':
            return {...state, listData: action.data};
        case 'LOAD_VIEW':
            return {...state, id:action.id, viewData: action.data};
        case 'CHANGE_MAIN_STATUS':
            return {...state, mainStatus: action.mainStatus};
        case 'CHANGE_LANGUAGE':
            return {...state, language: action.language};
        case 'CHANGE_HEADER_TYPE':
            return {...state, headerType: action.headerType};
        case 'CHANGE_THEME':
            return {...state, theme: action.theme};
        default:
            return state;
    }
};