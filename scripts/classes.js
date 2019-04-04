class Imagem extends Image {
  constructor(path, x = 0, y = 0) {
    super();
    this.src = path;
    this.px = x;
    this.py = y;
  }

  update() {

  }

  draw() {

  }
}

class Sprite extends Image {
  constructor(path, corte_width, corte_height, qtd_frames, x, y, updateRate = 4, drawRate = 15) {
    super();
    this.frames = qtd_frames;
    this.actualFrame = 0;
    this.src = path;
    this.corte_width = corte_width;
    this.corte_height = corte_height;
    this.px = x;
    this.py = y;
    this.updateRate = updateRate;
    this.drawRate = drawRate;
  }

  start() {
    setInterval(this.update, 1000 / this.drawRate);
    setInterval(this.update, 1000 / this.updateRate);
  }

  update() {
    if (this.px - 10 < -85) {
      this.px = 885;
    }
    this.px -= 10;
  }

  draw(ctx) {

    if (this.actualFrame > this.frames - 1) {
      this.actualFrame = 0;
    }

    ctx.drawImage(this,
      this.actualFrame * this.corte_width,
      0,
      this.corte_width,
      this.corte_height,
      this.px,
      this.py,
      this.corte_width,
      this.corte_height);

    this.actualFrame++;
  }
}

class sound {
  constructor(src) {
    this.som = document.createElement('audio');
    this.som.src = src;
  }

  play() {
    this.som.currentTime = 0;
    this.som.play();
  }

  stop() {
    this.som.pause();
    this.som.currentTime = 0;
  }

  volume(value){
    this.som.volume = value;
  }
}