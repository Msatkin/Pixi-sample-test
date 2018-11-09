import { Game } from "../app/game";
import { Button } from "../components/button/button";
import { IButtonSettings } from "../interfaces/IButtonSettings";
import { IViewSettings } from "../interfaces/IViewSettings";

export class View extends PIXI.Container {
    public name: string = "View";

    protected _buttons: Button[];
    protected _settings: IViewSettings;
    protected _container: PIXI.Container;

    constructor(settings: IViewSettings) {
        super();
        this.settings = settings;
        this._container = new PIXI.Container();
        this.addChildAt(this._container, 0);
    }

    /**
     * Start method
     * Sets onClick methods and Updates
     */
    public start(): void {
        console.log(`Starting ${this.name} view`);

        if (this.hasButtons) {
            this.settings.buttonSettings.map((settings: IButtonSettings, index: number) => {
                settings.onClick = () => this.buttonClicked(settings, index);
                return settings;
            });
        }

        this.update();
    }

    /**
     * Trigged when button is clicked
     * @param button Settings of the button clicked
     * @param id Index in button array (Need to switch out for actual Id)
     */
    public buttonClicked(button: IButtonSettings, id: number): void {
        console.log("Button was clicked");
    }

    /**
     * Update function for View
     * Currently just updates buttons
     */
    protected update(): void {
        if (this.hasButtons) {
            this.setButtons(this.settings.buttonSettings);
        }
    }

    /**
     * Updates buttons with new settings or creates the button if is hasn't been yet
     * @param buttonSettings Settings to apply to the buttons
     */
    private setButtons(buttonSettings: IButtonSettings[]): void {
        let button: Button;

        if (!this._buttons) {
            this._buttons = [];
        }

        buttonSettings.forEach((settings, index) => {
            if (this._buttons[index] !== undefined) {
                this._buttons[index].settings = settings;
            } else {
                button = new Button(settings);
                this.addChild(button);
                this._buttons.push(button);
            }
        });

        while (buttonSettings.length < this.buttons.length) {
            button = this._buttons.pop();
            this.removeChild(button);
            button.destroy();
        }
    }

    /**
     * Gets the View's buttons
     * Creates the buttons if they aren't already
     */
    public get buttons(): Button[] {
        if (!this._buttons) {
            if (this.hasButtons) {
                this.setButtons(this.settings.buttonSettings);
            } else {
                return null;
            }
        }
        return this._buttons;
    }

    /**
     * Sets the settings and updates
     */
    protected set settings(value: IViewSettings) {
        this._settings = value;
        this.update();
    }

    /**
     * Gets the settings for the view
     */
    protected get settings(): IViewSettings {
        return this._settings;
    }

    /**
     * Checks if the view has buttons to create
     */
    protected get hasButtons(): boolean {
        return (this._settings.buttonSettings !== undefined);
    }
}
