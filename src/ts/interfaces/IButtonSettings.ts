import { IGraphicsSettings } from "./IGraphicsSettings";

export interface IButtonSettings {
    // Size settings (portrait and landscape)
    dimensions: {
        portrait: PIXI.Point,
        landscape: PIXI.Point
    };
    // Positioning of button (portrait and landscape)
    position: {
        portrait: PIXI.Point,
        landscape: PIXI.Point
    };
    // Background to be used
    background: IGraphicsSettings;
    // Text to be displayed on the button
    text?: string;
    // onClick callback
    onClick?: () => any;
}
