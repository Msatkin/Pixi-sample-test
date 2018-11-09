import { Game } from "../app/game";

export class Utils {
    /**
     * Get data from URL parameters
     */
    public static get URLParams(): any {
        const query = location.search.substr(1);
        const result: any = {};
        query.split("&").forEach(((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        }));
        return result;
    }

    /**
     * Get text from language file
     * @param key ID of the text
     */
    public static getText(key: string): string {
        if (key !== undefined && key !== null && Game.language !== undefined && Game.language != null && Game.language[key] !== undefined) {
            return Game.language[key];
        }
        return key;
    }

    /**
     * Get the number of a color
     * @param color color to be converted
     */
    public static colorToNumber(color: number | string): number {
        if (typeof color === "string") {
            return color = parseInt(color.replace(/^#/, ""), 16);
        }
        return color;
    }
}
