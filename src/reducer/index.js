import * as actions from '../action';

export default function reducer(state = {}, action) {
    switch(action.type) {
        case 'LOAD_MAIN':
            return {...state, data: action.data};
        case 'LOAD_MENU':
            return {...state, id:action.id, data: action.data};
        case 'LOAD_VIEW':
            return {...state, id:action.id, data: action.data};
        default:
            return state;
    }
};