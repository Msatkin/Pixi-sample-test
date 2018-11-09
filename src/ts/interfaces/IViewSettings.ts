import { IButtonSettings } from "./IButtonSettings";

export interface IViewSettings {
    // Name of view: used as an id
    name: string;
    // Is this the default View
    default?: boolean;
    // Settings for buttons to be added to the view
    buttonSettings?: IButtonSettings[];
    // View specific settings
    viewSpecific?: any;
}
