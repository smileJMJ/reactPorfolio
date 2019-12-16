import * as actions from '../action';

const initalState = {
    id: '', // view 페이지 이름
    listData: [], // Main의 리스트 데이터
    viewData: {}, // View 데이터
    menuData: [], // 메뉴 데이터
    mainStatus: 'start', // 메인 상태(start, website, websolution, end)
    language: 'ko' // 언어
};

export default function reducer(state = initalState, action) {
    switch(action.type) {
        case 'LOAD_MAIN':
            return {...state, listData: action.data};
        case 'LOAD_MENU':
            return {...state, id:action.id, menuData: action.data};
        case 'LOAD_VIEW':
            return {...state, id:action.id, viewData: action.data};
        case 'CHANGE_MAIN_STATUS':
            return {...state, mainStatus: action.mainStatus}
        default:
            return state;
    }
};