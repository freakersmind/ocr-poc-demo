import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ocr-poc',
  templateUrl: './ocr-poc.component.html',
  styleUrls: ['./ocr-poc.component.scss']
})
export class OcrPocComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    await this.canvasInit()
  }

  ocrOjArr = [{
    coordinates: '18,72,170,140',
    attribName: 'sample_name1',
    attribClass: 'c1',
    top: 72,
    left: 18,
    width: 152,
    height: 68
  },
  {
    coordinates: '72,160,130,172',
    attribName: 'sample_name2',
    attribClass: 'c2',
    top: 160,
    left: 72,
    width: 58,
    height: 12
  },
  {
    coordinates: '15, 174, 254, 240',
    attribName: 'sample_name3',
    attribClass: 'c3',
    top: 174,
    left: 15,
    width: 239,
    height: 66
  },
  {
    coordinates: '325, 173,570, 240',
    attribName: 'sample_name4',
    attribClass: 'c4',
    top: 173,
    left: 325,
    width: 245,
    height: 67
  },
  {
    coordinates: '380, 158, 440, 172',
    attribName: 'sample_name5',
    attribClass: 'c5',
    top: 158,
    left: 380,
    width: 60,
    height: 14
  },
  {
    coordinates: '448,128,515,140',
    attribName: 'sample_name6',
    attribClass: 'c6',
    top: 128,
    left: 448,
    width: 67,
    height: 12
  },
  {
    coordinates: '448,114,515,125',
    attribName: 'sample_name7',
    attribClass: 'c7',
    top: 114,
    left: 448,
    width: 67,
    height: 11
  },
  {
    coordinates: '448,100,510,112',
    attribName: 'sample_name8',
    attribClass: 'c8',
    top: 100,
    left: 448,
    width: 62,
    height: 12
  },
  {
    coordinates: '448,87,520,98',
    attribName: 'sample_name9',
    attribClass: 'c9',
    top: 87,
    left: 448,
    width: 72,
    height: 11
  },
  {
    coordinates: '448,72,522, 84',
    attribName: 'sample_name10',
    attribClass: 'c10',
    top: 72,
    left: 448,
    width: 74,
    height: 12
  }
  ];
  canvas: any;
  context: any;
  image: any;

  async canvasInit() {
    this.canvas = document.getElementById('myCanvas');
    this.context = this.canvas.getContext('2d');
    this.image = new Image();
    await this.loadCanvas();
  }
  async getCursorPosition(canvas: any, event: any) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
  }

  async loadCanvas() {
    return new Promise<void>((resolve, reject) => {
      this.image.addEventListener("load", () => {
        resolve();
        this.context.width = window.innerWidth;
        this.context.height = window.innerHeight;
        this.context.drawImage(this.image, 0, 0);
      });
      this.image.addEventListener("error", () => {
        reject();
      });
      this.image.src = 'assets/invoice1.jpg';
      //b
      let _this = this;
      this.canvas.onmousemove = function (event: any) {
        //inner begin
        let elemLeft = _this.canvas.offsetLeft + _this.canvas.clientLeft,
          elemTop = _this.canvas.offsetTop + _this.canvas.clientTop;
        _this.getCursorPosition(_this.canvas, event)
        let x = event.pageX - elemLeft, y = event.pageY - elemTop;
        for (let pos = 0; pos < _this.ocrOjArr.length; pos++) {
          if (y >= _this.ocrOjArr[pos].top && y <= _this.ocrOjArr[pos].top + _this.ocrOjArr[pos].height &&
            x >= _this.ocrOjArr[pos].left && x <= _this.ocrOjArr[pos].left + _this.ocrOjArr[pos].width) {
            // important: correct mouse position:
            let rect = this.getBoundingClientRect(),
              x = event.clientX - rect.left,
              y = event.clientY - rect.top,
              i = 0, r;
            // _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height); // for demo
            _this.context.beginPath();
            _this.context.rect(_this.ocrOjArr[pos].left, _this.ocrOjArr[pos].top, _this.ocrOjArr[pos].width, _this.ocrOjArr[pos].height);

            // check if we hover it, fill red, if not fill it blue
            if (_this.context.isPointInPath(x, y)) {
              debugger;
              _this.canvas.strokeStyle = '#000000DE'
              _this.context.fillStyle = "#0000000A";
              _this.context.fill();
            } else {
              debugger
              _this.canvasInit();
            }
          }
        }
        //inner end
      };
      //e
    });
  }

  async drawRotated(degrees: any) {
    let canvas: any = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(degrees * Math.PI / 180);
    context.drawImage(this.image, -this.image.width / 2, -this.image.width / 2);
    context.restore();
  }
  async drawRect(pos: any) {
    debugger;
    let elemLeft = this.canvas.offsetLeft + this.canvas.clientLeft,
      elemTop = this.canvas.offsetTop + this.canvas.clientTop;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    await this.loadCanvas();
    let _this = this;
    await this.canvas.addEventListener('mousedown', function (event: any) {
      _this.getCursorPosition(_this.canvas, event)
      let x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
      if (y >= _this.ocrOjArr[pos].top && y <= _this.ocrOjArr[pos].top + _this.ocrOjArr[pos].height &&
        x >= _this.ocrOjArr[pos].left && x <= _this.ocrOjArr[pos].left + _this.ocrOjArr[pos].width) {
        // IMP: Type is needed here as angular needs to be told that it's an HTML input element but then it calls focus() before even knowing, that's why timeout
        setTimeout(() => (document.getElementsByClassName(_this.ocrOjArr[pos].attribClass)[0] as HTMLInputElement).focus(), 0);
        (document.getElementsByClassName(_this.ocrOjArr[pos].attribClass)[0] as HTMLInputElement).value = _this.ocrOjArr[pos].attribClass;
      }
    }, false);
    this.context.strokeStyle = "#1b56e0";
    this.context.beginPath();
    //   for (let i = 0; i < ocrOjArr.length; i++) {
    this.context.rect(this.ocrOjArr[pos].coordinates.split(',')[0], this.ocrOjArr[pos].coordinates.split(',')[1], this.ocrOjArr[pos].width, this.ocrOjArr[pos].height);
    // }
    this.context.stroke();
  }

}
