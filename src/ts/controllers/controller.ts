import { EventEmitter } from "events";
import { View } from "../views/view";
import { Game } from "../app/game";
import { IViewSettings } from "../interfaces/IViewSettings";
import { CardView } from "../views/cardView";
import { TextView } from "../views/textView";
import { FireView } from "../views/fireView";
import { MainView } from "../views/mainView";

export class Controller extends EventEmitter {
    constructor() {
        super();
        // Create all the views for the game
        Game.model.views = this.createViews(Game.model.config.viewSettings);
        // Set currentView as active child
        Game.pixiApp.stage.addChild(Game.model.currentView);
        // Start view
        Game.model.currentView.start();
    }

    /**
     * Start function (Useless at the moment)
     */
    public start(): void {
        console.log("Starting game");
    }

    /**
     * Switch to view requested
     * @param name name of view to be switched to
     */
    public changeView(name: string): void {
        Game.pixiApp.stage.removeChild(Game.model.currentView);
        Game.model.currentView = Game.model.views.find((view) => view.name === name);
        Game.pixiApp.stage.addChild(Game.model.currentView);
        Game.model.currentView.start();
    }
    /**
     * Creates an array of Views
     * @param viewSettings Settings for each view to be created
     */
    private createViews(viewSettings: IViewSettings[]): View[] {
        const views: View[] = [];
        let view: View;
        viewSettings.forEach((settings) => {
            view = this.createView(settings);
            view.on(MainView.CHANGE_VIEW, this.changeView.bind(this));
            views.push(view);
        });

        return views;
    }

    /**
     * Creates a View
     * @param settings Settings for view
     */
    private createView(settings: IViewSettings): View {
        switch (settings.name) {
            case "card":
                return new CardView(settings);
            case "text":
                return new TextView(settings);
            case "fire":
                return new FireView(settings);
            default:
                return new MainView(settings);
        }
    }
}
