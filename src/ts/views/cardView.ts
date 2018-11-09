import { IViewSettings } from "../interfaces/IViewSettings";
import { TestView } from "./testView";
import { TweenMax, TimelineMax, Sine } from "gsap";
import { Game } from "../app/game";

export class CardView extends TestView {
    public name: string = "card";
    private _deck: PIXI.Sprite[];
    private _lowerTimelines: TimelineMax[];
    private _upperTimelines: TimelineMax[];
    private _atInitialPosition: boolean;
    private _cardContainer: PIXI.Container;
    private _cardsMoved;
    private _counter: PIXI.Text;

    constructor(settings: IViewSettings) {
        super(settings);
        this.createFPSCounter();
        this._cardContainer = new PIXI.Container();
        this.addChild(this._cardContainer);
        this.createDeck();
        this._atInitialPosition = true;
    }

    /**
     * Begins Test
     */
    public beginTest(): void {
        super.beginTest();
        this._cardsMoved = 0;
        if (this._atInitialPosition) {
            this._upperTimelines.reverse().forEach((timeline) => timeline.restart(true));
            this._upperTimelines.reverse();
        } else {
            this._lowerTimelines.forEach((timeline) => timeline.restart(true));
        }
        this._atInitialPosition = !this._atInitialPosition;
        this.buttons[1].text = "test_running";
        this.buttons[1].disable = true;
    }

    /**
     * Re-enables button on complete
     */
    public endTest(): void {
        super.endTest();
        this.buttons[1].text = "start";
        this.buttons[1].disable = false;
    }

    /**
     * Creates the deck of cards
     */
    private createDeck(): void {
        this.resetDeck();

        let sprite: PIXI.Sprite;
        for (let i = 0; i < this._settings.viewSpecific.cardCount; i++) {
            // Creates card sprite and sets it in an offset position
            sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this._settings.viewSpecific.cardTexture));
            sprite.position.set(this.deckPosition.x +  (i * this.settings.viewSpecific.offset.x), this.deckPosition.y + (i * this.settings.viewSpecific.offset.y));
            sprite.anchor.set(0.5, 0.5);

            // Create timelines for the sprite
            this._deck.push(sprite);
            this._lowerTimelines.push(this.createTimeLine(sprite, i, true));
            this._upperTimelines.push(this.createTimeLine(sprite, this._settings.viewSpecific.cardCount - i));
            this._cardContainer.addChild(sprite);
        }

        this._upperTimelines[0].eventCallback("onComplete", this.endTest.bind(this));
        this._lowerTimelines[this._lowerTimelines.length - 1].eventCallback("onComplete", this.endTest.bind(this));
    }

    /**
     * Moves a sprite to the top of the container
     * @param sprite Sprite to move to the top
     */
    private moveToTop(sprite: PIXI.Sprite): void {
        const index = this._cardContainer.children.findIndex((child) => child === sprite);
        const newSprite = this._cardContainer.removeChildAt(index);
        this._cardContainer.addChildAt(newSprite, this._cardsMoved);
        this._cardsMoved++;
    }

    /**
     * Resets the whole deckS
     */
    private resetDeck(): void {
        if (this._deck) {
            this._deck.forEach((sprite) => sprite.destroy());
        }

        this._cardContainer.children = [];

        this._deck = [];
        this._upperTimelines = [];
        this._lowerTimelines = [];
    }

    /**
     * @param sprite Sprite to control
     * @param delayMultiplier Delay
     * @param travelDown Initial pass
     */
    private createTimeLine(sprite: PIXI.Sprite, delayMultiplier: number = 0, travelDown: boolean = false): TimelineMax {
        const timeline: TimelineMax = new TimelineMax();
        const distance: number = (travelDown) ? this._settings.viewSpecific.travelDistance : -this._settings.viewSpecific.travelDistance;
        const end: number = sprite.position.y + distance;

        timeline.add(TweenMax.from(sprite, 2, {y: end, ease: Sine.easeOut}), 0);
        timeline.add(() => {
            this.moveToTop(sprite);
        }, .5);
        timeline.pause();
        timeline.delay(delayMultiplier * this._settings.viewSpecific.delay);

        return timeline;
    }

    /**
     * Creates a fps counter
     */
    private createFPSCounter(): void {
        this._counter = new PIXI.Text();
        Game.pixiApp.ticker.add(() => {
            this._counter.text = `FPS: ${Game.pixiApp.ticker.FPS.toFixed(2).toString()}`;
        });
        this.addChild(this._counter);
    }

    /**
     * Gets the config position of the deck
     */
    public get deckPosition(): PIXI.Point {
        return (Game.isPortrait) ? this._settings.viewSpecific.position.portrait : this._settings.viewSpecific.position.landscape;
    }
}
