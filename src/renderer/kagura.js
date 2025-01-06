class KaguraCaptcha {
  constructor(option) {
    this.initCount = option.initCount;
    this.ctx = option.ctx;
  }
  init() {
    this.kagura = new Array(9).fill(0);
    let t = 0;
    while (t < this.initCount) {
      let i = Math.floor(Math.random() * this.kagura.length);
      if (this.kagura[i] === 0) {
        this.kagura[i] = 1;
        t++;
      }
    }
    this.mount();
  }
  randint(min, max, count) {
    if (min > max) {
      throw new Error("最小值不能大于最大值");
    }
    if (count <= 0) {
      throw new Error("个数必须大于0");
    }
    const result = [];
    const range = max - min + 1;
    while (result.length < count) {
      const randomInt = Math.floor(Math.random() * range) + min;
      if (!result.includes(randomInt)) {
        result.push(randomInt);
      }
    }
    return result;
  }
  mount() {
    const set = this.randint(1,15,this.initCount)
    const frag = new DocumentFragment();
    let ser = 0
    for (let i of this.kagura) {
      const img = document.createElement("img");
      if (i) {
        img.src = `kagura/true/kagura (${set[ser]}).jpg`;
        ser++
      } else {
        img.src = `kagura/false/false.jpg`;
      }
      frag.appendChild(img);
    }
    this.ctx.appendChild(frag);
  }
}
