import { BasicTween } from "./basicTween.js";
export class TweenManager
{
    static tweens = [];

    static createTweens(source, target , config) {
        const tween = new BasicTween(source,target,config);
        this.tweens.push(tween);
        return tween;
        
    }

    static update(deltatime)
    {
        this.tweens.forEach(tween => {
            if(tween.isActive)
            {
                tween.update(deltatime);
            }

        });
    }
}