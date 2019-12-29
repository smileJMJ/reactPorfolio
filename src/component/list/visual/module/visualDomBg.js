import { TweenMax, TimelineMax } from 'gsap';

class visualDomBg {
    constructor(option) {
        this.ele = option.ele;
        this.max = option.max || 200;
        this.min = option.min || 80;
        this.intervalTime = option.intervalTime || 1;
    }
    init () {
        this.playMotion();
    }
    makeSpan() {
        let span = document.createElement('span');
        let maxWidth = this.max;
        let minWidth = this.min;
        let width = Math.round(Math.random() * (maxWidth-minWidth) + minWidth);
        let left = Math.round(Math.random() * 100);
        let opacity = Math.random() * 0.8 + 0.1;

        span.style.width = span.style.height = `${width}px`;
        span.style.left = `${left}%`;
        span.style.opacity = opacity;
        this.ele.appendChild(span);

        return span;
    }
    playMotion() {
        let _ = this;

        function motion(t) {
            let span;
            console.log(t);
            if(Math.round(t) % 2000 < 10) {
                span = _.makeSpan();
                TweenMax.to(span, _.intervalTime*5, {top: '100%', ease: 'Quad.easeIn'});
                let timeline = new TimelineMax();
                timeline.to(span, 3, {x: -50, ease:'Quad.easeIn'}, "-=0.2")
                    .to(span, 3, {x: 50, ease:'Quad.easeIn'}, "-=0.2");
            }
            requestAnimationFrame(motion);
        }
        requestAnimationFrame(motion);
    }
}

export default visualDomBg;