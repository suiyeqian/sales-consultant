import { Injectable }    from '@angular/core';

@Injectable()
export class WaterMarkService {
  watermarkdivs = [];
  dftSettings = {
    wmk_txt: '销售助手',
    wmk_x: 15, // 起始位置x轴坐标
    wmk_y: 10, // 起始位置Y轴坐标
    wmk_rows: 0, // 行数
    wmk_cols: 0, // 列数
    wmk_x_space: 10, // x轴间隔
    wmk_y_space: 100, // y轴间隔
    wmk_font: '微软雅黑',
    wmk_color: 'rgba(255, 255, 255, 0.93)',
    wmk_fontsize: '.32rem',
    wmk_alpha: 0.12, // 水印透明度
    wmk_width: Math.max(document.body.scrollWidth, document.body.clientWidth) > 450 ? 200 : 120, // 水印宽
    wmk_height: 60, // 水印高
    wmk_angle: 36, // 水印倾斜度数
  };

  constructor() {
  }

  load(settings = {}, addHeight = 0): void {
    let src = Object.assign({}, settings);
    for (let key of Object.keys(src)){
      if (src[key] && this.dftSettings[key] && src[key] === this.dftSettings[key]) {
        continue;
      } else if (src[key]) {
        this.dftSettings[key] = src[key];
      }
    }

    // 创建文档碎片
    let oTemp = document.createDocumentFragment();
    // 创建水印外壳div
    let otdiv = document.getElementById('watermarkWrap');
    if (otdiv) {
      document.body.removeChild(document.getElementById('watermarkWrap'));
      this.watermarkdivs = [];
    }
    otdiv = document.createElement('div');
    otdiv.id = 'watermarkWrap';
    otdiv.style.pointerEvents = 'none';
    document.body.appendChild(otdiv);

    // 获取页面最大宽度 & 最大长度
    let page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
    let page_height = Math.max(document.body.scrollHeight, document.body.clientHeight);
    let wmk_cos = Math.cos(this.dftSettings.wmk_angle * 2 * Math.PI / 360);

    // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    let sumWidth_x = this.dftSettings.wmk_width * wmk_cos * this.dftSettings.wmk_cols;
    let sumSpace_x = this.dftSettings.wmk_x_space * (this.dftSettings.wmk_cols - 1);
    if (this.dftSettings.wmk_cols === 0 || (this.dftSettings.wmk_x + sumWidth_x + sumSpace_x > page_width)) {
      let containerWith = page_width - this.dftSettings.wmk_x - this.dftSettings.wmk_x_space;
      let pieceWith = this.dftSettings.wmk_width * wmk_cos + this.dftSettings.wmk_x_space;
      this.dftSettings.wmk_cols = Math.floor(containerWith / pieceWith);
      let allSpace_x = containerWith - this.dftSettings.wmk_width * this.dftSettings.wmk_cols;
      this.dftSettings.wmk_x_space = Math.floor(allSpace_x / (this.dftSettings.wmk_cols - 1));
    }
    // 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    // let sumWidth_y = this.dftSettings.wmk_height * this.dftSettings.wmk_rows;
    // let sumSpace_y = this.dftSettings.wmk_y_space * (this.dftSettings.wmk_rows - 1);
    // if (this.dftSettings.wmk_rows === 0 || (this.dftSettings.wmk_y + sumWidth_y + sumSpace_y > page_height)) {
      let containerHeight = page_height - this.dftSettings.wmk_y + addHeight;
      let pieceHeight = this.dftSettings.wmk_height + this.dftSettings.wmk_y_space;
      this.dftSettings.wmk_rows = Math.floor(containerHeight / pieceHeight);
      // let allSpace_y = containerHeight - this.dftSettings.wmk_height * this.dftSettings.wmk_rows;
      // this.dftSettings.wmk_y_space = Math.floor(allSpace_y / (this.dftSettings.wmk_rows - 1));
    // }
    // console.log(page_width, this.dftSettings.wmk_cols, this.dftSettings.wmk_x_space);
    // console.log(page_height, this.dftSettings.wmk_rows, this.dftSettings.wmk_y_space);

    let x, y;

    for (let i = 0; i < this.dftSettings.wmk_rows; i++) {
      y = this.dftSettings.wmk_y + (this.dftSettings.wmk_y_space + this.dftSettings.wmk_height) * i;
      for (let j = 0; j < this.dftSettings.wmk_cols; j++) {
        x = this.dftSettings.wmk_x + (this.dftSettings.wmk_width + this.dftSettings.wmk_x_space) * j;

        let mask_div = document.createElement('div');
        let oText = document.createTextNode(this.dftSettings.wmk_txt);
        mask_div.appendChild(oText);
        // 设置水印相关属性
        mask_div.id = 'mask_div' + i + j;
        // 设置水印div倾斜显示
        if (mask_div.style.hasOwnProperty('webkitTransform')) {
          mask_div.style['webkitTransform'] = 'rotate(-' + this.dftSettings.wmk_angle + 'deg)';
        }
        if (mask_div.style.hasOwnProperty('MozTransform')) {
          mask_div.style['MozTransform'] = 'rotate(-' + this.dftSettings.wmk_angle + 'deg)';
        }
        if (mask_div.style.hasOwnProperty('msTransform')) {
          mask_div.style['msTransform'] = 'rotate(-' + this.dftSettings.wmk_angle + 'deg)';
        }
        if (mask_div.style.hasOwnProperty('OTransform')) {
          mask_div.style['OTransform'] = 'rotate(-' + this.dftSettings.wmk_angle + 'deg)';
        }
        mask_div.style.transform = 'rotate(-' + this.dftSettings.wmk_angle + 'deg)';
        mask_div.style.visibility = '';
        mask_div.style.position = 'absolute';
        // 选不中
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = 'hidden';
        mask_div.style.zIndex = '9999';

        mask_div.style.opacity = this.dftSettings.wmk_alpha.toString();
        mask_div.style.fontSize = this.dftSettings.wmk_fontsize;
        mask_div.style.fontFamily = this.dftSettings.wmk_font;
        mask_div.style.color = this.dftSettings.wmk_color;
        mask_div.style.textAlign = 'left';
        mask_div.style.width = this.dftSettings.wmk_width + 'px';
        mask_div.style.height = this.dftSettings.wmk_height + 'px';
        mask_div.style.display = 'block';

        // 附加到文档碎片中
        otdiv.appendChild(mask_div);
        this.watermarkdivs.push(otdiv); // 控制页面大小变化时水印字体
      };
    };
    // 一次性添加到document中
    document.body.appendChild(oTemp);
  };
}
