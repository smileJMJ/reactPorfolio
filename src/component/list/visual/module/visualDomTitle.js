class visualDomTitle {
    constructor(option) {
        this.data = option.data || [];
        this.intervalTime = option.intervalTime  * 1000 || 1000;
    }
    init (data) {
        this.data = data;
        console.log(this);
    }
}

export default visualDomTitle;