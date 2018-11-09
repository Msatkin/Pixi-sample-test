import { View } from "./view";
import { IViewSettings } from "../interfaces/IViewSettings";
import { IButtonSettings } from "../interfaces/IButtonSettings";
import { MainView } from "./mainView";

export class TestView extends View {
    public static START_TEST: string = "startTest";
    public static PAUSE_TEST: string = "pauseTest";

    public name: string = "test";
    protected _isTestRunning: boolean;

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
                this.beginTest();
                break;
        }
    }

    // On test start
    public beginTest(): void {
        console.log("Beginning Test");
        this._isTestRunning = true;
    }

    // On test end
    public endTest(): void {
        console.log("Test ended");
        this._isTestRunning = false;
    }
}
