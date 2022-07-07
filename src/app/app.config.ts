import { Injectable } from "@angular/core";

@Injectable()
export class AppConfig {

    constructor() {
    }

    //canvas image viewer configuration
    public static FILL_STYLE_HOVER = '#0000000A';
    public static STROKE_STYLE_HOVER = '#000000DE';
    public static FILL_STYLE_CLICK = '#00A9CE14';
    public static STROKE_STYLE_CLICK = '#00A9CE';
    public static STROKE_WIDTH = 2;
    public static IMAGE_START_SCALE = 1;
    public static IMAGE_MAX_SCALE = 1.2;
    public static IMAGE_MIN_SCALE = 0.8;

}