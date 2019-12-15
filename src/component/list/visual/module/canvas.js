import TweenMax from 'gsap';

class Canvas {
    constructor(canvas, data) {
        this.data = data;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.index = 0;
    }
    init() {
        window.onresize = () => { this.resize(); }

        this.reset();
        this.draw(this.data[this.index]);
    }
    reset() {
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    resize() {
        let canvas = this.canvas;
        if((canvas.width !== canvas.clientWidth) || (canvas.height !== canvas.clientHeight)) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            this.draw(this.data[this.index]);
        }
    }
    draw(data) {
        let canvas = this.canvas;
        let img = new Image();

        img.width = canvas.width;
        img.src = data.img;
        img.onload = () => {
            this.playDraw(data, img);
        }
    }
    playDraw(data, img, opt) {
        let ctx = this.ctx;
        let canvas = this.canvas;

        ctx.drawImage(img, 0, (canvas.height - img.height) * 0.5, img.width, img.height);
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.font = '300px NotoSanskr_Bold';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.name, canvas.width * 0.5, canvas.height * 0.5);

        ctx.fillStyle = data.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


}

export default Canvas;