export class GraphicText extends PIXI.Container {
    private _objects: PIXI.Sprite[] | PIXI.Text[];
    private _minHeight: number;
    private _position: PIXI.Point;

    constructor() {
        super();
    }

    /**
     * Sets the text value
     * Creates all the text and sprite obects required and positions them correctly
     */
    public set text(value: string) {
        // Clears old items
        while (this.children.length > 0) {
            this.removeChildAt(0).destroy();
        }

        // Reset min height to max number value
        this._minHeight = Number.MAX_VALUE;
        // Reset position to default
        this._position = new PIXI.Point(0, 0);

        // Splits items into an array of arrays
        const items = value.split("<img>").map((item) => item.split("src="));
        // Creates all the items
        this._objects = items.map(this.createItem.bind(this));
        // Normalizes size to match the lowest height
        this._objects.forEach((item) => {
            item.height = this._minHeight;
            item.scale.set(item.scale.y, item.scale.y);
            // Shifts position over to keep items in line
            item.position = this._position;
            this._position.x += item.width + 2;
            this.addChild(item);
        });
    }

    /**
     * Creates a Text or Sprite item depending on how many elements are in the passed array
     * @param item Either an array with 1 element (Text item) or an array with 2 items (Sprite item)
     */
    private createItem(item: string[]): PIXI.Text | PIXI.Sprite {
        let createdItem: PIXI.Text | PIXI.Sprite;

        createdItem = (item.length <= 1) ? new PIXI.Text(item[0]) : new PIXI.Sprite(PIXI.Texture.fromFrame(item[1]));
        // Record lowest height for normalizing values later
        this._minHeight = (createdItem.height < this._minHeight) ? createdItem.height : this._minHeight;

        return createdItem;
    }
}
