import { TweenMax, TimelineMax } from 'gsap';

class visualDomTitle {
    constructor(option) {
        this.data = option.data || [];
        this.ele = option.ele;
        this.intervalTime = option.intervalTime || 1;
        this.index = 0;
        this.length = 0;
    }
    init (data) {
        let _ = this;
        _.data = data;
        _.length = data.length;
        _.autoPlay();
    }
    autoPlay() {
        let _ = this;
        _.make();
        _.motion();
        _.index = (_.index === _.length-1) ? 0 : _.index+1;
    }
    make() {
        let _ = this;
        let h1 = document.createElement('h1');
        let data = _.data[_.index];

        h1.textContent = data.name;
        h1.style.backgroundImage = `url(${data.img})`;
        _.ele.appendChild(h1);
    }
    motion() {
        let _ = this;
        let h1 = _.ele.childNodes[0];
        let value = {
            scale: { start: 0.8, end: 1 },
            blur: { start: 30, end: 0 },
            opacity: { start: 0, end: 1 }
        };
        let duration = 0.8;
        let delay = duration + _.intervalTime;

        TweenMax.killTweensOf(h1);
        TweenMax.set(h1, {
            webkitFilter:'blur(' + value.blur.start + 'px)',
            filter:'blur(' + value.blur.start + 'px)',
            opacity: value.opacity.start
        });

        // show motion
        TweenMax.to(h1, duration-0.5, {opacity: value.opacity.end, ease: 'Quad.easeOut'});
        TweenMax.to(h1, duration, {webkitFilter:'blur(' + value.blur.end + 'px)', filter:'blur(' + value.blur.end + 'px)', ease: 'Quad.easeOut'});

        // hide motion
        TweenMax.to(h1, duration+0.5, {opacity: value.opacity.start, delay: delay, ease: 'Quad.easeInOut', onComplete: function() {
            h1.remove();
            _.autoPlay();
        }});
        TweenMax.to(h1, duration, {webkitFilter:'blur(' + value.blur.start + 'px)', filter:'blur(' + value.blur.start + 'px)', delay: delay, ease: 'Quad.easeIn'});
    }
}

export default visualDomTitle;