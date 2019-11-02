import axios from 'axios';

export default function getData(type, id) {
    let data;

    if(type === 'LOAD_MAIN') { // 메인 페이지일 때
        console.log('axios LOAD_MAIN');
        axios.get('/json/listData.json')
        .then(response => {
            data = response['data']
        })
        .catch(error => {
            console.log(error);
        });
    } else if(type === 'LOAD_MENU') { // 메뉴 펼쳤을 때
        axios.get('/json/menuData.json')
        .then(response => {
            data = response['data']['data']
        })
        .catch(error => {
            console.log(error);
        });
    } else if(type === 'LOAD_VIEW') { // view 페이지 일 때
        axios.get(`/json/${id}.json`)
            .then(response => {
                data = response['data']['data']
            })
            .catch(error => {
                console.log(error);
            });
    }

    return data;
}