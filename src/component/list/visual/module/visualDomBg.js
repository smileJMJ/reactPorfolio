import { TweenMax, TimelineMax } from 'gsap';

class visualDomBg {
    constructor(option) {
        this.ele = option.ele;
        this.max = option.max || 200;
        this.min = option.min || 80;
        this.intervalTime = option.intervalTime || 1;
    }
    init () {
        this.reset();
        this.playMotion();
    }
    reset() {
        if(!this.ele.hasChildNodes()) return;

        this.ele.childNodes.forEach((v) => {
            if(this.motion) cancelAnimationFrame(this.motion);
            this.ele.removeChild(v);
        });
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

            if(Math.round(t) % 1000 < 20) {
                span = _.makeSpan();
                TweenMax.to(span, _.intervalTime*5, {top: '100%', ease: 'Quad.easeIn', onComplete: function() {
                    span.remove();
                }});
                let timeline = new TimelineMax({repeat: 1, yoyo: true});
                timeline.to(span, 3, {x: -50, ease:'Linear.easeNone'})
                    .to(span, 3, {x: 0, ease:'Linear.easeNone'});
            }
            _.motion = requestAnimationFrame(motion);
        }
        _.motion = requestAnimationFrame(motion);
    }
}

export default visualDomBg;