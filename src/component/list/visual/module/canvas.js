import TweenMax from 'gsap';

class Canvas {
    ctx;
    index;
    timeTemp;
    startTime;

    constructor(canvas, data) {
        this.data = data;
        this.canvas = canvas;
    }
    init() {
        this.resize();
        window.onresize = () => { this.resize(); }

        this.ctx = this.canvas.getContext('2d');
        this.index = 0;
        this.timeTemp = 3000;

        this.draw(this.data[this.index]);
    }
    reset() {
        this.ctx.globalCompositeOperation = 'source-over';
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
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

        this.reset();

        img.width = canvas.width;
        img.src = data.img;
        img.onload = () => {
            if(document.fonts) document.fonts.load('300px NotoSanskr_Bold').then(() => { this.playDraw(data, img); });
            else this.playDraw(data, img);
        }
    }
    playDraw(data, img) {
        let ctx = this.ctx;
        let canvas = this.canvas;


        ctx.drawImage(img, 0, (canvas.height - img.height) * 0.5, img.width, img.height);
        ctx.globalCompositeOperation = 'destination-atop';

        ctx.font = '250px NotoSanskr_Bold';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.name, canvas.width * 0.5, canvas.height * 0.5);


        let animate = requestAnimationFrame((timestamp) => {
            if(!this.startTime) this.startTime = timestamp;
            //console.log(timestamp, this.startTime)
            if((timestamp - this.startTime) <= this.timeTemp) this.playDraw(data, img);
            else {
                cancelAnimationFrame(animate);
                this.startTime = null;
                this.index++;
                if(this.index >= this.data.length) this.index = 0;
                this.draw(this.data[this.index]);
            }
        })
    }


}

export default Canvas;