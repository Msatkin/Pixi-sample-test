import { IButtonSettings } from "../../interfaces/IButtonSettings";
import { Game } from "../../app/game";
import { Utils } from "../../util/utils";
import { GraphicText } from "../text/text";

export class Button extends PIXI.Container {
    // Settings for the button
    protected _settings: IButtonSettings;
    // Background graphic
    protected _background: PIXI.Graphics;
    // Text item, Can use images in the string
    protected _text: GraphicText;

    constructor(settings: IButtonSettings) {
        super();
        this.settings = settings;
        this.interactive = true;
    }

    /**
     * Updates button with new settings
     */
    protected update(): void {
        // Resets listener
        this.removeListener("pointerup");
        if (this._settings.onClick) {
            this.on("pointerup", this._settings.onClick);
        }

        // Updates position
        this.position.set(this.presetPosition.x, this.presetPosition.y);

        // Creates new background
        this.background = this.createBackground();

        if (this._settings.text) {
            this.text = this._settings.text;
        }
    }

    /**
     * Creates the button background
     */
    protected createBackground(): PIXI.Graphics {
        const background: PIXI.Graphics = new PIXI.Graphics();
        const alpha: number = this._settings.background.alpha || 1.0;
        const drawBorder: boolean = this._settings.background.border || false;

        if (drawBorder) {
            const borderColor: number = Utils.colorToNumber(this._settings.background.borderColor) || 0;
            const borderWidth: number = this._settings.background.borderSize || 1;
            background.lineStyle(borderWidth, borderColor, 1);
        }

        background.beginFill(Utils.colorToNumber(this._settings.background.color), alpha);

        const width: number = this.dimensions.x;
        const height: number = this.dimensions.y;
        const borderRadius = this._settings.background.borderRadius || 0;

        background.drawRoundedRect(0, 0, width, height, borderRadius);
        background.endFill();

        return background;
    }

    /**
     * Sets the background to the new value
     * Removes and destroys the old background if it exists
     */
    public set background(value: PIXI.Graphics) {
        if (this._background) {
            this.removeChild(this._background);
            this._background.destroy();
        }
        this._background = value;
        this.addChildAt(this._background, 0);
    }

    /**
     * Gets the background of the button
     * Creates a new background if none is found
     */
    public get background(): PIXI.Graphics {
        if (!this._background) {
            this.background = this.createBackground();
        }
        return this._background;
    }

    /**
     * Sets the text value of the button's text object
     * Creates a text object if none exists
     */
    public set text(value: string) {
        if (!this._text) {
            this._text = new GraphicText();
            this.addChild(this._text);
        }
        this._settings.text = value;
        this._text.text = Utils.getText(value);
        this._text.position.set((this.dimensions.x - this._text.width) / 2, (this.dimensions.y - this._text.height) / 2);
    }

    /**
     * Returns the button's text value
     */
    public get text(): string {
        if (!this._text) {
            this.text = "";
        }
        return this._text.text;
    }

    /**
     * Sets settings and updates values
     */
    public set settings(value: IButtonSettings) {
        this._settings = value;
        this.update();
    }

    /**
     * Gets the current dimensions
     */
    public get dimensions(): PIXI.Point {
        return (Game.isPortrait) ? this._settings.dimensions.portrait : this._settings.dimensions.landscape;
    }

    /**
     * Gets the position set in the config
     */
    public get presetPosition(): PIXI.Point {
        return (Game.isPortrait) ? this._settings.position.portrait : this._settings.position.landscape;
    }

    /**
     * Toggles button's interactability
     */
    public set disable(value: boolean) {
        this.interactive = !value;
    }
}
