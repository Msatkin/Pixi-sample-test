import { EventEmitter } from "events";

export class NetworkController extends EventEmitter {
    // Singleton
    protected static _instance: NetworkController;

    public static get active(): NetworkController {
        if (this._instance == null) {
            this._instance = new NetworkController();
        }
        return this._instance;
    }
    protected extension: string = "/relay/p/";

    constructor() {
        super();
    }

    /**
     * Get JSON file at each path supplied
     * @param paths Paths of the JSON files
     */
    public requestJSONs(paths: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (paths.length > 0) {
                this.ajax(paths.shift(), {}, "GET").then(
                    (successResult) => resolve(successResult),
                    () => resolve(this.requestJSONs(paths)));
            } else {
                resolve();
            }
        });
    }

    /**
     * Get the JSON file at the path supplied
     * @param path Path of the JSON file
     */
    public requestJSON(path: string): Promise<any> {
        return new Promise((resolve, reject) =>
            this.ajax(path, {}, "GET").then(
                (success) => resolve(success),
                () => resolve())
        );
    }

    /**
     * Create AJAX request
     * @param url URL of request
     * @param data Data to send
     * @param type Request type
     * @param headers Request header
     */
    protected ajax(url: string, data: any = null, type: string = "GET", headers?: string[][]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const asynch = true;
                const xmlHttp = new XMLHttpRequest();
                xmlHttp.withCredentials = true;
                xmlHttp.onreadystatechange = () => {
                    if (xmlHttp.readyState === 4) {
                        switch (xmlHttp.status) {
                            case 200:
                                resolve(JSON.parse(xmlHttp.responseText));
                            default:
                                reject(xmlHttp.status);
                        }
                    }
                };
                xmlHttp.open(type, url, asynch);
                if (data) {
                    xmlHttp.setRequestHeader("Content-type", "application/json");
                }
                xmlHttp.setRequestHeader("Accept", "application/json");

                if (headers) {
                    headers.forEach((h) => xmlHttp.setRequestHeader(h[0], h[1]));
                }

                xmlHttp.send(data);
            } catch (e) {
                reject(e);
            }
        });
    }
}
