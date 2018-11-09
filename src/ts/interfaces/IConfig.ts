import { IAsset } from "./IAsset";
import { IViewSettings } from "./IViewSettings";

export interface IConfig {
    /** Name of the game */
    name: string;

    assetMapping: { [id: string]: string; }; // Keyed map to assets
    assets: IAsset[]; // Assets to be loaded
    preloadAssets: IAsset[]; // Assets to be preloaded

    // Dimensions for canvas (Allows for ratio preservation)
    dimensions: {
        landscape: PIXI.Point;
        portrait: PIXI.Point;
    };
    /** Should the ratio be preserved */
    perserveRatio?: boolean;

    // Settings for each view to be in the game
    viewSettings?: IViewSettings[];
}
