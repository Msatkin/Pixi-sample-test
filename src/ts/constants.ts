export class Constants {
    /**
     * Default settings for PIXI
     */
    public static PIXI_SETTINGS: PIXI.ApplicationOptions = {
        backgroundColor: 0xffffff,
        height: window.innerHeight,
        legacy: true,
        resolution: window.devicePixelRatio,
        roundPixels: false,
        transparent: false,
        width: window.innerWidth
    };
}
