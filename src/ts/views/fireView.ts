import { IViewSettings } from "../interfaces/IViewSettings";
import { TestView } from "./testView";
import { Fire } from "../components/fire/fire";
import { Game } from "../app/game";
import { Utils } from "../util/utils";

export class FireView extends TestView {
    public name: string = "fire";

    public _fire: Fire;
    public _fires: Fire[];

    private _isTesting: boolean;
    private _paused: boolean;

    /**
     * Start function
     * Sets position and size
     */
    public start(): void {
        super.start();
        this.fire.position.set((Game.dimensions.x - this._settings.viewSpecific.fireDimensions.x) / 2 + this._settings.viewSpecific.firePosition.x, (Game.dimensions.y - this._settings.viewSpecific.fireDimensions.y) / 2 + this._settings.viewSpecific.firePosition.y);
        this.fire.size = this._settings.viewSpecific.fireDimensions;
        this._isTesting = true;
    }

    /**
     * Toggles between being paused and playing
     */
    public beginTest(): void {
        if (this._isTesting) {
            this.fire.paused = false;
            this.buttons[1].text = Utils.getText("start");
        } else {
            this.fire.paused = true;
            this.buttons[1].text = Utils.getText("pause_test");
        }

        this._isTesting = !this._isTesting;
    }

    public get fire(): Fire {
        if (!this._fire) {
            this._fire = new Fire(this._settings.viewSpecific.fireTexture);
            this._container.addChild(this._fire);
        }
        return this._fire;
    }
}
