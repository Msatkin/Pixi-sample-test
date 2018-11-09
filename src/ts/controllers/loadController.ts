import { EventEmitter } from "events";
import { IAsset } from "../interfaces/IAsset";
import { Constants } from "../constants";
import { Game } from "../app/game";
import { fail } from "assert";
import { Utils } from "../util/utils";

export class LoadController extends EventEmitter {
    // Events
    public static PRELOAD_COMPLETE: string = "PreloadComplete";
    public static PRELOAD_PROGRESS: string = "PreloadProgress";
    public static LOAD_COMPLETE: string = "LoadComplete";
    public static LOAD_PROGRESS: string = "LoadProgress";

    // Singleton
    protected static _active: LoadController;

    public static get active(): LoadController {
        if (this._active == null) {
            this._active = new LoadController();
        }
        return this._active;
    }

    /**
     * Preloads assets
     * @param assets Assets to be preloaded
     */
    public preload(assets: IAsset[]): void {
        this.addAssets(assets);
        this.beginPreloading();
    }

    /**
     * Loads assets
     * @param assets Assets to be preloaded
     */
    public load(assets: IAsset[]): void {
        this.addAssets(assets);
        this.beginLoading();
    }

    /**
     * Adds assets to loader
     * @param assets Assets to be loaded
     */
    protected addAssets(assets: IAsset[]): void {
        if (assets === undefined) {
            console.warn("No assets to load.");
            return;
        }
        assets.forEach((asset: IAsset) => PIXI.loader.add(asset.id, asset.url));
    }

    /**
     * Begins preloading assets
     */
    protected beginPreloading(): void {
        PIXI.loader.onProgress.add((loader: PIXI.loaders.Loader) => this.emit(LoadController.PRELOAD_PROGRESS, loader));
        PIXI.loader.load(() => this.emit(LoadController.PRELOAD_COMPLETE));
    }

    /**
     * Begins loading assets
     */
    protected beginLoading(): void {
        PIXI.loader.onProgress.add((loader: PIXI.loaders.Loader) => this.emit(LoadController.LOAD_PROGRESS, loader));
        PIXI.loader.load(() => {
            const loader: PIXI.loaders.Loader = new PIXI.loaders.Loader();
            loader.load(() => this.emit(LoadController.LOAD_COMPLETE));
        });
    }
}
