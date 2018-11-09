import { TweenMax, Linear, TimelineMax } from "gsap";
import { Game } from "../app/game";

export class LoadingView extends PIXI.Container {
    protected bar: PIXI.Graphics;

    constructor(texture: PIXI.Texture) {
        super();
        this.name = "Loading View";
        this.createLogo(texture);
    }
    /** Initialise the logo and the spinner graphics */
    protected createLogo(texture: PIXI.Texture) {
        console.log("Creating loading logo");
        const dimensions = Game.dimensions;
        const loader: PIXI.Sprite = new PIXI.Sprite(texture);

        loader.position.x = dimensions.x / 2;
        loader.position.y = dimensions.y / 2;
        loader.anchor.set(.5, .5);
        this.addChild(loader);

        TweenMax.to(loader, 2, {rotation: Math.PI * 2, ease: Linear.easeNone, repeat: -1});
    }
}
