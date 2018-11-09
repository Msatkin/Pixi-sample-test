import { IViewSettings } from "../interfaces/IViewSettings";
import { TestView } from "./testView";
import { GraphicText } from "../components/text/text";
import { TimelineLite, TweenLite } from "gsap";
import { Game } from "../app/game";
import { Utils } from "../util/utils";
import { IButtonSettings } from "../interfaces/IButtonSettings";
import { MainView } from "./mainView";

export class TextView extends TestView {
    public name: string = "text";

    private _text: GraphicText;
    private _timeline: TimelineLite;
    private _isTesting: boolean;

    constructor(settings: IViewSettings) {
        super(settings);
        this._timeline = new TimelineLite();
        this._timeline.add(TweenLite.to(this, 2, {}));
        this._timeline.eventCallback("onComplete", this.updateText.bind(this));

        this.updateText();
        this._timeline.pause();
    }

    /**
     * Trigged when button is clicked
     * @param button Settings of the button clicked
     * @param id Index in button array (Need to switch out for actual Id)
     */
    public buttonClicked(button: IButtonSettings, id: number): void {
        switch (id) {
            case 0:
                this.emit(MainView.CHANGE_VIEW, "main");
                break;
            case 1:
                this.toggleTest();
                break;
        }
    }

    /**
     * Toggles between being paused and playing
     */
    public toggleTest(): void {
        if (this._isTesting) {
            this._timeline.pause();
            this.buttons[1].text = Utils.getText("start");
        } else {
            this._timeline.play();
            this.buttons[1].text = Utils.getText("pause_test");
        }

        this._isTesting = !this._isTesting;
    }

    /**
     * Pauses Test
     */
    public endTest(): void {
        this._timeline.pause(0);
    }

    /**
     * Updates text with a random quote
     */
    public updateText(): void {
        this.text.text = this.getRandomQuote();
        this._text.position.set((Game.dimensions.x - this.text.width) / 2, (Game.dimensions.y - this.text.height) / 2);
        this._timeline.restart();
    }

    /**
     * Gets random quote from supplied words and images
     */
    private getRandomQuote(quoteLength: number = 3): string {
        const strings: string[] = [];

        while (strings.length < quoteLength) {
            if (Math.random() > .5) {
                strings.push(Utils.getText(this._settings.viewSpecific.words[Math.floor(Math.random() * this._settings.viewSpecific.words.length)]));
            } else {
                const image = this._settings.viewSpecific.images[Math.floor(Math.random() * this._settings.viewSpecific.images.length)];
                strings.push(`<img>src=${image}<img>`);
            }
        }

        let quote: string = "";
        strings.forEach((item) => quote = quote.concat(item));

        return quote;
    }

    /**
     * Gets the graphicText object
     * Creates a graphicText object if none is found
     */
    private get text(): GraphicText {
        if (!this._text) {
            this._text = new GraphicText();
            this._text.position.set(Game.dimensions.x / 2, Game.dimensions.y / 2);
            this._container.addChild(this._text);
        }

        return this._text;
    }
}
