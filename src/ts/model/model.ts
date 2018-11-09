import * as EventEmitter from "events";
import { View } from "../views/view";
import { IConfig } from "../interfaces/IConfig";

export class Model extends EventEmitter {
    // All views for the game
    public views: View[];
    // Config settings for the game
    public config: IConfig;

    // The currently active View
    private _currentView: View;

    /**
     * Start function (Useless at the moment)
     */
    public start(): void {
        console.log("Starting game");
    }

    /**
     * Get the currently active view or finds the default View if no view is active
     */
    public get currentView(): View {
        if (!this._currentView) {
            if (this.views) {
                try {
                    const defaultViewName: string = this.config.viewSettings.find((view) => view.default).name;
                    const defaultView: View = this.views.find((view) => view.name === defaultViewName);
                    this._currentView = defaultView;
                    return this._currentView;
                } catch {
                    console.log("No default view found");
                    return;
                }
            }
            console.log("No views loaded");
            return;
        } else {
            return this._currentView;
        }
    }

    /**
     * Sets the currentView to the new View
     */
    public set currentView(value: View) {
        this._currentView = value;
    }
}
