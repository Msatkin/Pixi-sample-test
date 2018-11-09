import { NetworkController } from "../controllers/networkController";
import { LoadController } from "../controllers/loadController";
import { LoadingView } from "../views/loadingView";
import { Constants } from "../constants";
import { IConfig } from "../interfaces/IConfig";
import { Model } from "../model/model";
import { View } from "../views/view";
import { Controller } from "../controllers/controller";

export class Game {
    // Game application
    public static pixiApp: PIXI.Application;
    // Game config data
    public static config: IConfig;
    // Language data
    public static language: any;
    // Language to use
    public static languageType: string;
    // The model for the game
    public static model: Model;
    // The controller for the game;
    private _controller: Controller;

    // View to be shown while assets are loading
    private _loadingView: LoadingView;

    constructor() {
        this.initGame();
    }

    /**
     * Beings entire game
     */
    private initGame(): void {
        console.log("Initilizing game");
        this.getGameConfig()
        .then(this.loadLanguageFiles.bind(this))
        .then(this.initPixi.bind(this));
    }

    /**
     * Requests the game configuration
     */
    private async getGameConfig(): Promise<any> {
        return new Promise((res, rej) => {
            NetworkController.active.requestJSON("game/config.json").then((success) => {
                Game.config = success;
                res(success);
            }, (fail) => rej(fail));
        });
    }

    /**
     * Requests the default language and the language to be used
     */
    private async loadLanguageFiles(): Promise<any> {

        const languagesFilesToLoad: string[] = [];
        languagesFilesToLoad.push(
            `game/languages/${Game.languageType}.json`,
            `game/languages/default.json`);

        const requests: any = [];
        languagesFilesToLoad.forEach((language) => requests.push(NetworkController.active.requestJSON(language)));

        return Promise.all(requests).then((results: any[]) =>  Game.language = this.mergeObjects(results));
    }

    /**
     * Merges a list of objects into one single object
     * @param objects Array of objects to merge
     */
    private mergeObjects(objects: any[]): any {
        let mergedObjects: any = {};

        objects.forEach((item) => mergedObjects = { ...mergedObjects, ...item });

        return mergedObjects;
    }

    /**
     * Creates the pixi application, sets the canvas, and assigns a onResize function
     */
    private initPixi(): void {
        // Set the dimensions for the game
        const dimensions: PIXI.Point = (Game.isPortrait) ? Game.config.dimensions.portrait : Game.config.dimensions.landscape;
        Constants.PIXI_SETTINGS.width = dimensions.x;
        Constants.PIXI_SETTINGS.height = dimensions.y;

        // Set pixi canvas element
        Constants.PIXI_SETTINGS.view = document.getElementById("game-canvas") as HTMLCanvasElement;

        // Create the pixi application
        Game.pixiApp = new PIXI.Application(Constants.PIXI_SETTINGS);

        // PIXI.settings.PRECISION_FRAGMENT = "highp";

        // Add the pixi app to the root
        const root: HTMLDivElement = document.getElementById("app-root") as HTMLDivElement;
        root.appendChild(Game.pixiApp.view);
        Game.pixiApp.view.id = "game-canvas";

        // Adjust for protrait
        if (Game.isPortrait) {
            root.style.overflowY = "auto";
            Game.pixiApp.renderer.view.style.top = "0px";
            Game.pixiApp.renderer.view.style.transform = "translate(-50%, 0px)";
            Game.pixiApp.renderer.plugins.interaction.autoPreventDefault = false;
        }

        // Set resize function and call it to update the size
        $(window).resize(this.onResize.bind(this));
        this.onResize();

        // Create the game's model
        this.initModel();
    }

    /**
     * Creates the model
     */
    private initModel(): void {
        Game.model = new Model();
        Game.model.config = Game.config;

        this.beginPreload();
    }

    /**
     * Begins preloading of assets
     */
    private beginPreload(): void {
        LoadController.active.once(LoadController.PRELOAD_COMPLETE, this.handlePreloadComplete.bind(this));
        LoadController.active.preload(Game.config.preloadAssets);
    }

    /**
     * Begins loading of assets
     */
    private beginLoad(): void {
        LoadController.active.once(LoadController.LOAD_COMPLETE, this.handelLoadComplete.bind(this));
        LoadController.active.load(Game.config.assets);
    }

    /**
     * Handles the preload complete event
     */
    private handlePreloadComplete(): void {
        console.log("Asset preloading complete");

        this._loadingView = new LoadingView(PIXI.Texture.fromFrame("loading"));
        Game.pixiApp.stage.addChild(this._loadingView);

        this.beginLoad();
    }

    /**
     * Handles the load complete event
     * Removes loading screen and creates the controller
     */
    private handelLoadComplete(): void {
        console.log("Asset loading complete");

        Game.pixiApp.stage.removeChild(this._loadingView);
        this._loadingView.destroy();
        this._loadingView = null;

        this._controller = new Controller();
    }

    /**
     * Handles window resize event
     * Can maintain ratio is needed
     */
    private onResize(): void {
        let width: number;
        let height: number;

        if (Game.config.perserveRatio) {
            const gameRatio: number = Constants.PIXI_SETTINGS.width / Constants.PIXI_SETTINGS.height;

            // If the inner width is too large preserve the ratio by multipling the inner height by the desired ratio
            if (window.innerWidth / window.innerHeight >= gameRatio) {
                width = window.innerHeight * gameRatio;
                height = window.innerHeight;
            } else {
                // If the inner height is too large preserve the ratio by dividing the inner width by the desired ratio
                width = window.innerWidth;
                height = window.innerWidth / gameRatio;
            }

            // If mobile use max witdh
            if (Game.isPortrait) {
                width = document.documentElement.clientWidth;
                height = document.documentElement.clientWidth / gameRatio;
            }
        } else {
            width = window.innerWidth;
            height = window.innerHeight;
        }

        // Set the view's width
        Game.pixiApp.renderer.view.style.width = width + "px";
        Game.pixiApp.renderer.view.style.height = height + "px";
    }

    /**
     * Checks if game display is portrait
     */
    public static get isPortrait(): boolean {
        return (window.innerWidth < window.innerHeight);
    }

    /**
     * Gets dimensions of the game
     */
    public static get dimensions(): PIXI.Point {
        return Game.isPortrait ? Game.config.dimensions.portrait : Game.config.dimensions.landscape;
    }
}
