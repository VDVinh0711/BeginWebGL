
import { Tween } from "./TweenHelper.js";
export class BasicTween
{

    constructor(source,pointTarget, config = {})
    {

       
        if (typeof source !== "object" || typeof pointTarget !== "object") {
            throw new Error("source and target must be objects");
        }

        this.source = source;
        this.duration = config.duration || 1;
        this.easing = config.easing || Tween.easeLinear;
        this.pointTarget = pointTarget;
        this.delay = config.delay || 0;
        this.elapsed = -this.delay;

        this.repeat = config.repeat || 0;
        this.yoyo = config.yoyo || false;
        this.repeatCount = 0;
        this.isActive = false;
        

        //event
        this.onStartCallBack = config.onStart || null;
        this.onCompleteCallBack = config.onComplete || null;
        this.init();
    }
    init()
    {
        this.keys = Object.keys(this.pointTarget);
        this.start = {};
      
        for (let key of this.keys) {
            this.start[key] = this.source[key];
        }
    }

    Play()
    {
        this.isActive = true;
        this.onStartCallBack?.();
    }
    Complete()
    {
        this.onCompleteCallBack?.();
        this.isActive = false;
    }

    update(deltaTime)
    {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            // tween finished or repeated
            if (this.repeatCount < this.repeat) {
                this.onRepeat();
                this.elapsed = -this.delay; // reset the elapsed time
                this.repeatCount++;
            }
            else {
                this.elapsed = this.duration;
                this.Complete();
            }
        }
    
        if (this.elapsed < 0) {
            return;
        }
        for (let key of this.keys) {
            if (!this.source.hasOwnProperty(key)) {
                continue;
            }
            this.source[key] = this.start[key] + (this.pointTarget[key] - this.start[key]) * this.easing(this.elapsed / this.duration);
        }
    }

    onRepeat() {
        if (this.yoyo) {
            // swap start and target to create a yoyo effect
            for (let key of this.keys) {
                let temp = this.start[key];
                this.start[key] = this.pointTarget[key];
                this.pointTarget[key] = temp;
            }
        }
        else {
            // reset the properties
            for (let key of this.keys) {
                this.source[key] = this.start[key];
            }
        }
    }



}