import { Game } from "../../app/game";
import { fireShader } from "../../filters/fireShader";

export class Fire extends PIXI.Sprite {
    public _count: number;
    private _image: string;
    private _shader: PIXI.Filter<any>;
    private _paused: boolean;

    constructor(image: string) {
        super();
        this._count = 0;
        this._image = image;

        this.texture = PIXI.Texture.fromFrame(this._image);
        this.filters = [ this.customShader ];

        Game.pixiApp.ticker.add(this.animate.bind(this));

        this.paused = true;
    }

    /**
     * Updates uniform data for the shader
     * @param deltaTime Time
     */
    public updateShaderUniforms(deltaTime: number): void {
        this.customShader.uniforms.time = deltaTime;
        this.customShader.uniforms.image = PIXI.Texture.fromFrame(this._image);
    }

    /**
     * Animates the fire
     */
    public animate(enable: boolean = true) {
        if (!this._paused) {
            this.updateShaderUniforms(this._count);
            this._count = (this._count < 0) ? 0 : this._count + .01;
        }
    }

    /**
     * Gets the shader
     * Creates a new shader if null
     */
    public get customShader(): PIXI.Filter<any> {
        if (!this._shader) {
            this._shader = new PIXI.Filter(null, fireShader);
        }
        return this._shader;
    }

    /**
     * Sets shader
     */
    public set customShader(value: PIXI.Filter<any>) {
        this._shader = value;
    }

    /**
     * Sets size of the Fire
     */
    public set size(value: PIXI.Point) {
        this.width = value.x;
        this.height = value.y;
    }

    public set paused(value: boolean) {
        if (!this._paused && !value) {
            this._paused = true;
        } else if (this._paused && value) {
            this._paused = false;
        }
    }
}
