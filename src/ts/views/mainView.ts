import { View } from "./view";
import { IViewSettings } from "../interfaces/IViewSettings";
import { IButtonSettings } from "../interfaces/IButtonSettings";

export class MainView extends View {
    public static CHANGE_VIEW: string = "changeView";

    public name: string = "main";

    /**
     * Switches to a different View
     * (Needs to be re-done)
     * @param button Settings of Button clicked
     * @param id Index of Button clicked
     */
    public buttonClicked(button: IButtonSettings, id: number): void {
        switch (id) {
            case 0:
                this.emit(MainView.CHANGE_VIEW, "card");
                break;
            case 1:
                this.emit(MainView.CHANGE_VIEW, "text");
                break;
            case 2:
                this.emit(MainView.CHANGE_VIEW, "fire");
                break;
        }
    }
}
