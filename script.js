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


// self.phi_2d = np.zeros((N,N,N,N)) //「8*8行列」の8*8行列を作る(例の縞模様全パターン64種)
// 		for i in range(N):
// 			for j in range(N): // 「0」の8*8行列に対して
// 				phi_i,phi_j = np.meshgrid(self.phi_1d[i],self.phi_1d[j]) //phi_i, phi_jを定義、1次元基底関数
// 				self.phi_2d[i,j] = phi_i*phi_j //phi_i*phi_jの行列を8*8行列に突っ込む



//いわゆる普通の行列の積を求めているのはdct()だけ...
//glMatrixというライブラリが使えそう
//普通に公式とシグマの使い方を勉強して、for文に落とlし込んでみたい(17:51)

// DCT Class
function DCT(n){
  this.N = n
  this.ph1 = []
  for (var i = 0; i < this.N; i++) {
    this.ph1[i] = this.ph(i);
  }
  this.ph1Matrix = math.matrix(this.ph1) //確実にOK

  this.ph2Matrix = math.matrix(math.zeros([this.N, this.N, this.N, this.N]))
  for(var i = 0; i < this.N; i++){
    for(var j = 0; j < this.N; j++){
      var m = meshgrid(this.N, this.ph1Matrix._data[i], this.ph1Matrix._data[j]) //確実にうまくいってる
      console.log(m)
      this.ph2Matrix._data[i][j] = math.multiply(m[0], m[1])//列がすべてph1Matrix[i]の行列 * 行がすべてph1Matrix[j]の行列
      //おかしい、、、
      //meshgridがダメなのか、math.multiplyがダメなのかわからん
      console.log(math.multiply(m[0]._data[0][0], m[1]._data[0][0]))
    }
  }
  for(var i = 0; i < this.N; i++){
    for(var j = 0; j < this.N; j++){
      console.log("M" + i + ", " + j + ": " + this.ph2Matrix._data[i][j])
    }
  }
}

// returns DCT matrix
DCT.prototype.dct = function(data) {
  return math.multiply(math.matrix(data), this.ph1Matrix) //OK
}

// returns matrix
DCT.prototype.idct = function(dataMatrix){
  var d = []
  for(var i = 0; i < this.N; i++){
    d[i] = math.sum(math.multiply(dataMatrix, math.transpose(this.ph1Matrix))._data[i])
  }
  return d
}

// returns matrix
DCT.prototype.dct2 = function(data) {
  //基底行列 * 8*8ピクセルデータ * 基底の転置行列
  var m = math.multiply(this.ph2Matrix, math.matrix(data))//4次元なので計算できない
  return math.multiply(m, math.transpose(this.ph2Matrix))




  //ph2Matrixを64*64行列にしたやつ*dataを1次元配列にしたやつの、行ごとの合計を8*8行列にする
  //ph2Matrixを64*64行列にしたやつ -> OK
  // var tmp = []
  // for(var i = 0; i < (this.N * this.N); i++){
  //   var catRow = []
  //   for(var j = 0; j < this.N; j++){
  //     catRow = catRow.concat(this.ph2Matrix._data[Math.floor(i / 8)][j]._data[Math.floor(i / 8)])
  //     tmp[i] = catRow
  //   }
  // }
  // var reshapedPh2Matrix = math.matrix(tmp)
  //
  // //dataを1次元配列にしたやつ -> OK
  // var reshapedData = []
  // for (var i = 0; i < this.N; i++) {
  //   reshapedData = reshapedData.concat(data[i])
  // }
  //
  // //かけた -> OK
  // var m = math.multiply(reshapedPh2Matrix, math.matrix(reshapedData))
  //
  // //行列に戻す
  // var dct2Array = []
  // while(m._data.length) dct2Array.push(m._data.splice(0, this.N))
  // return math.matrix(dct2Array)
}

DCT.prototype.idct2 = function(dataMatrix) {
  //np.sum((c.reshape(N,N,1)*self.phi_2d.reshape(N,N,N*N)).reshape(N*N,N*N),axis=0).reshape(N,N)
  //DCTされたデータ(引数,8*8)をN,N,1にreshapeしたものと2次元基底行列をN,N,N*Nにreshapeしたものをかけて、それをNN,NNにreshapeして、
  //sumしたものをN,Nにreshape

}

// returns 変換行列
DCT.prototype.ph = function(k) {
  var kph = []
  if (k == 0) {
    for (var i = 0; i < this.N; i++) {
      kph[i] = (1 / Math.sqrt(this.N))
    }
  } else {
    for (var i = 0; i < this.N; i++) {
      kph[i] = (Math.sqrt(2 / this.N) * Math.cos(((2 * i + 1) * k * Math.PI) / (2 * this.N)))
    }
  }
  return kph;
}

// returns matrix
var meshgrid = function(n, arrayToColumn, arrayToRow){
  var columnMatrix = math.matrix(math.zeros([n, n]))
  var rowMatrix = math.matrix(math.zeros([n, n]))
  for(var i = 0; i < n; i++){
    for(var j = 0; j < n; j++){
      columnMatrix._data[i][j] = arrayToColumn[j]
      rowMatrix._data[i][j] = arrayToRow[i]
    }
  }
  return [columnMatrix, rowMatrix]
}

// Initialize
var N = 8
var dct = new DCT(N)
var randomOctetImage = []

for(var i = 0; i < N; i++){
  randomOctetImage[i] = []
  for(var j = 0; j < N; j++){
    randomOctetImage[i][j] = (Math.random() * 256)
  }
}

var d2 = dct.dct2(randomOctetImage)
console.log(d2)

// var d = dct.dct(r)
// var id = dct.idct(d)
//
// console.log(toText(r))
// console.log(d)
// console.log(toText(id))

function toText(array) {
  var txt = ''
  for(var i = 0; i < array.length; i++){
    txt += array[i] + ","
  }
  return txt
}

// draw bitmap
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var width = imageData.width, height = imageData.height;
var pixels = imageData.data;  // ピクセル配列：RGBA4要素で1ピクセル
// console.log(dct.ph2Matrix._data[7][7]._data[])
for (var y = 0; y < randomOctetImage.length; ++y) {
  for (var x = 0; x < randomOctetImage.length; ++x) {
    var base = (y * width + x) * 4;
    var brightness = dct.ph2Matrix._data[3][4]._data[y][x]
    pixels[base + 0] = brightness;  // Red
    pixels[base + 1] = brightness;  // Green
    pixels[base + 2] = brightness;  // Blue
    pixels[base + 3] = 255;  // Alpha
  }
}

// 変更した内容をキャンバスに書き戻す
ctx.putImageData(imageData, 0, 0);
