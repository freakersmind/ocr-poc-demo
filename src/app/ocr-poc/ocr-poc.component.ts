import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';

export interface Rect {
  id: string, x: number, y: number, width: number, height: number, fill: string, stroke: string, strokewidth: 1, isSelected: boolean, isHighlighted: boolean,
  string: string
}
export interface RectArea {
  id: any, x: any, y: any, width: any, height: any, isSelected: any, string: any
}

@Component({
  selector: 'app-ocr-poc',
  templateUrl: './ocr-poc.component.html',
  styleUrls: ['./ocr-poc.component.scss']
})
export class OcrPocComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    this.ocrData = [
      { id: "Remit Address", x: 18, y: 72, width: 152, height: 68, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data1' },
      { id: "Sold to", x: 72, y: 160, width: 58, height: 12, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data2' },
      { id: "Sold to address", x: 15, y: 174, width: 239, height: 66, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data3' },
      { id: "Ship to", x: 325, y: 173, width: 245, height: 67, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data4' },
      { id: "Ship to address", x: 380, y: 158, width: 60, height: 14, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data5' },
      { id: "Customer PO", x: 448, y: 128, width: 67, height: 12, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data6' },
      { id: "Terms of payment", x: 448, y: 114, width: 67, height: 11, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data7' },
      { id: "Invoice date", x: 448, y: 100, width: 62, height: 12, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data8' },
      { id: "Invoice No", x: 448, y: 87, width: 72, height: 11, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data9' },
      { id: "Invoice amount", x: 448, y: 72, width: 74, height: 12, fill: "#0000000A", stroke: "#000000DE", strokewidth: 1, isSelected: false, isHighlighted: true, string: 'data10' },
    ];
  }


  async ngAfterViewInit() {
    await this.canvasInit();
    await this.initFields();
  }

  ocrData: Rect[] = [];
  canvas: any;
  context: any;
  offsetX: any;
  offsetY: any;
  image: any;

  strokewidth = 2;
  inputs = ['input', 'select', 'textarea'];
  prevFocus: any;
  rotation = 0; // degrees
  scale = AppConfig.IMAGE_START_SCALE;
  zooming = false;
  rotating = false;

  //initialize canvas
  async canvasInit() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.offsetX = this.canvas.offsetLeft;
    this.offsetY = this.canvas.offsetTop;
    this.image = new Image();
    await this.loadImage();
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);

  }

  //initialize fields
  async initFields() {
    for (var index = 0; index < this.ocrData.length; index++) {
      let data = this.ocrData[index];
      let element = <HTMLInputElement>document.getElementById(data.id);
      element.setAttribute('data-x', data.x.toString());
      element.setAttribute('data-y', data.y.toString());
      element.setAttribute('data-width', data.width.toString());
      element.setAttribute('data-height', data.height.toString());
      element.setAttribute('data-is-selected', false.toString());
      element.setAttribute('value', data.string.toString());
    }
  }

  //load image promise to be drawnon canvas
  async loadImage() {
    debugger;
    return new Promise<void>((resolve, reject) => {
      this.image.addEventListener("load", async (e: any) => {
        resolve();
        this.context.width = window.innerWidth;
        this.context.height = window.innerHeight;
        if (this.rotating) {
          this.rotating = false;
          this.context.drawImage(this.image, -this.image.width / 2, -this.image.width / 2);
          e.stopPropagation();
          console.log(e)
        } else if (this.zooming) {
          this.zooming = false;
          let newWidth = this.canvas.width * this.scale;
          let newHeight = this.canvas.height * this.scale;
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          // this.context.save();
          this.context.translate(-((newWidth - this.canvas.width) / 2), -((newHeight - this.canvas.height) / 2));
          this.context.scale(this.scale, this.scale);
          this.context.drawImage(this.image, 0, 0);
          // this.context.restore();
        }
        else {
          this.context.drawImage(this.image, 0, 0);
        }
      });
      this.image.addEventListener("error", () => {
        reject();
      });
      this.image.src = 'assets/invoice1.jpg';
    });

  }

  //draw a shape over canvas
  async draw(stroke: any, fill: any, rect: RectArea) {
    this.context.save();
    this.context.beginPath();
    this.context.fillStyle = fill || AppConfig.FILL_STYLE_HOVER;;
    this.context.strokeStyle = stroke || AppConfig.STROKE_STYLE_HOVER;
    this.context.lineWidth = AppConfig.STROKE_WIDTH;
    if (rect) {
      this.context.rect(rect.x, rect.y, rect.width, rect.height);
    }
    this.context.stroke();
    this.context.fill();
    //handle rotation
    if (this.rotating) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.context.rotate(this.rotation * Math.PI / 180);
      await this.loadImage();
    }
    //handle Zoom in Zoom out
    if (this.zooming) {
      await this.loadImage();
    }
    this.context.restore();
  }

  //check if the clicked coordinates fall inside the defined area
  async isPointInside(x: any, y: any, rect: Rect) {
    return (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
  }

  //Event listener for canvas mouse down
  handleMouseDown = async (e: any) => {
    let activeElement = document.activeElement;
    if (activeElement && this.inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
      let mouseX = Math.floor(e.clientX - this.offsetX);
      let mouseY = Math.floor(e.clientY - this.offsetY);

      for (var i = 0; i < this.ocrData.length; i++) {
        if (await this.isPointInside(mouseX, mouseY, this.ocrData[i])) {
          await this.canvasInit();
          setTimeout(() => this.prevFocus.focus(), 0);
          activeElement.setAttribute('data-x', this.ocrData[i].x.toString());
          activeElement.setAttribute('data-y', this.ocrData[i].y.toString());
          activeElement.setAttribute('data-width', this.ocrData[i].width.toString());
          activeElement.setAttribute('data-height', this.ocrData[i].height.toString());
          activeElement.setAttribute('value', this.ocrData[i].string.toString());
          break;
        }
      }
    } else {
      alert('First select a field on the left, and only after that pick a value from the image on the right.');
      await this.canvasInit();
    }
  }

  //Event listener for canvas mouse move
  handleMouseMove = async (e: any) => {
    setTimeout(() => { this.mouseStopped(e) }, 300);
  }

  async mouseStopped(e: any) {
    let activeElement = document.activeElement;
    if (activeElement && this.inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
      let mouseX = Math.floor(e.clientX - this.offsetX);
      let mouseY = Math.floor(e.clientY - this.offsetY);

      let rectArea: RectArea = <RectArea>{};
      for (var i = 0; i < this.ocrData.length; i++) {
        if (await this.isPointInside(mouseX, mouseY, this.ocrData[i])) {
          await this.canvasInit();
          rectArea = {
            x: this.ocrData[i].x,
            y: this.ocrData[i].y,
            width: this.ocrData[i].width,
            height: this.ocrData[i].height,
            isSelected: false,
            id: '',
            string: this.ocrData[i].string
          };
          await this.draw(AppConfig.STROKE_STYLE_HOVER, AppConfig.FILL_STYLE_HOVER, rectArea);
          //drawing highlighted area
          rectArea = {
            x: activeElement.getAttribute('data-x'),
            y: activeElement.getAttribute('data-y'),
            width: activeElement.getAttribute('data-width'),
            height: activeElement.getAttribute('data-height'),
            isSelected: activeElement.getAttribute("data-is-selected"),
            id: activeElement.id,
            string: activeElement.getAttribute('value')
          };
          await this.draw(AppConfig.STROKE_STYLE_CLICK, AppConfig.FILL_STYLE_CLICK, rectArea);
          break;
        }
      }
    }
  }

  //save previous element focus for image section click handling
  async readFocus(e: any) {
    this.prevFocus = e;
    let rectArea: RectArea = {
      x: e.getAttribute('data-x'),
      y: e.getAttribute('data-y'),
      width: e.getAttribute('data-width'),
      height: e.getAttribute('data-height'),
      isSelected: e.getAttribute('data-is-selected'),
      id: e.id,
      string: e.getAttribute('value')
    };
    Array.from(document.getElementsByClassName("form-field-dyamic")).forEach(function (item, index) {
      if (item == e) {
        item.setAttribute("data-is-selected", "true")
      } else {
        item.setAttribute("data-is-selected", "false")
      }
    });
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    await this.canvasInit();
    rectArea.isSelected = true;
    await this.draw(AppConfig.STROKE_STYLE_CLICK, AppConfig.FILL_STYLE_CLICK, rectArea);
  }

  async rotateLeft() {
    this.rotation -= 90;
    this.rotating = true;
    let rect: RectArea = <RectArea>{};
    await this.draw(AppConfig.STROKE_STYLE_HOVER, AppConfig.FILL_STYLE_HOVER, rect);
  }

  async rotateRight() {
    this.rotation += 90;
    this.rotating = true;
    let rect: RectArea = <RectArea>{}
    await this.draw(AppConfig.STROKE_STYLE_HOVER, AppConfig.FILL_STYLE_HOVER, rect);
  }

  async zoomIn() {
    let newScale = Math.round((this.scale + 0.1) * 100) / 100;
    if (newScale <= AppConfig.IMAGE_MAX_SCALE) {
      this.zooming = true;
      this.scale = newScale;
      let rect: RectArea = <RectArea>{}
      await this.draw(AppConfig.STROKE_STYLE_HOVER, AppConfig.FILL_STYLE_HOVER, rect);
    }

  }

  async zoomOut() {
    let newScale = Math.round((this.scale - 0.1) * 100) / 100;
    if (newScale >= AppConfig.IMAGE_MIN_SCALE) {
      this.zooming = true;
      this.scale = newScale;
      let rect: RectArea = <RectArea>{}
      await this.draw(AppConfig.STROKE_STYLE_HOVER, AppConfig.FILL_STYLE_HOVER, rect);
    }

  }
}