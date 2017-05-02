var canvas = document.getElementById('dctcanvas')
var ctx = canvas.getContext('2d')
/* 四角を描く */
// ctx.beginPath();
// ctx.moveTo(20, 20);
// ctx.lineTo(120, 20);
// ctx.lineTo(120, 120);
// ctx.lineTo(20, 120);
// ctx.closePath();
// ctx.stroke();

// var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// var width = imageData.width, height = imageData.height;
// var pixels = imageData.data;  // ピクセル配列：RGBA4要素で1ピクセル

// ピクセル単位で操作できる
// for (var y = 0; y < height; ++y) {
//   for (var x = 0; x < width; ++x) {
//     var base = (y * width + x) * 4;
//     // なんかピクセルに書き込む
//     pixels[base + 0] = x;  // Red
//     pixels[base + 1] = y;  // Green
//     pixels[base + 2] = Math.max(255 - x - y, 0);  // Blue
//     pixels[base + 3] = 255;  // Alpha
//   }
// }
//
// // 変更した内容をキャンバスに書き戻す
// ctx.putImageData(imageData, 0, 0);


function DCT(n){
  this.N = n
  this.ph1 = []
  for (var i = 0; i < this.N; i++) {
    this.ph1[i] = this.ph(i);
  }
  console.log(this.ph1);
}

DCT.prototype.dct = function(data) {
  var d = []
  for (var i = 0; i < this.N; i++) {
    d[i] = []
    for (var j = 0; j < this.N; j++) {
      d[i][j] = data[i] * this.ph1[i][j];
    }
  }
  return d
  // return math.multiply(data, this.ph1)
}

DCT.prototype.idct = function(data){
  var d = []
  var m = []
  var ph1t = math.transpose(math.matrix(this.ph1))

  for (var i = 0; i < this.N; i++) {
    m[i] = []
    for (var j = 0; j < this.N; j++) {
      m[i][j] = data[i][j] * ph1t._data[i][j]
    }
  }

  //変換行列の転置行列とdataをかけて、行ごとの和を返す
  // var ph1t = math.transpose(math.matrix(this.ph1))
  // var m = math.multiply(data, ph1t)
  for(var i = 0; i < this.N; i++){
    d[i] = math.sum(m[i])
  }
  return d
}

DCT.prototype.ph = function(k) {
  var kph = []
  if (k == 0) {
    for (var i = 0; i < this.N; i++) {
      kph[i] = 1 / Math.sqrt(this.N);
    }
  } else {
    for (var i = 0; i < this.N; i++) {
      kph[i] = Math.sqrt(2 / this.N) * Math.cos(((2 * i + 1) * k * Math.PI) / (2 * this.N));
    }
  }
  return kph;
}

// Initialize
var N = 8
var dct = new DCT(N)
var r = []

for(var i = 0; i < N; i++){
  r[i] = Math.random(-1, 1) * 10
}

var d = dct.dct(r)
var id = dct.idct(d)

console.log(toText(r))
console.log(d)
console.log(toText(id))

function toText(array) {
  var txt = ''
  for(var i = 0; i < array.length; i++){
    txt += array[i] + ","
  }
  return txt
}
