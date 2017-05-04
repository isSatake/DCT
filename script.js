// DCT Class
function DCT(n){
  this.N = n
  this.ph1 = []
  for (var i = 0; i < this.N; i++) {
    this.ph1[i] = this.ph(i);
  }
  this.ph1Matrix = math.matrix(this.ph1)
}

DCT.prototype.dct = function(data) {
  return math.multiply(math.matrix(data), this.ph1Matrix)
}

DCT.prototype.idct = function(data){
  var d = []
  for(var i = 0; i < this.N; i++){
    d[i] = math.sum(math.multiply(math.matrix(data), math.transpose(this.ph1Matrix))._data[i])
  }
  return d
}

DCT.prototype.dct2 = function(data) {
  var m = math.multiply(this.ph1Matrix, math.matrix(data))
  return math.multiply(m, math.transpose(this.ph1Matrix))._data
}

DCT.prototype.idct2 = function(data) {
  var m  = math.multiply(math.transpose(this.ph1Matrix), math.matrix(data))
  return math.multiply(m, this.ph1Matrix)._data
}

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

//Image Class
function DCTImage(n, array2d){
  this.N = n
  this.raw2d = array2d
  this.blocks4d = this.divide(this.raw2d)
  this.dct = new DCT(this.N)
}

DCTImage.prototype.divide = function(array2d) {
  var blocks4d = []
  var width = array2d.length
  for(var i = 0; i < width / this.N; i++){
    blocks4d[i] = []
    for(var j = 0; j < width / this.N; j++){
      var block = []
      for(var k = 0; k < this.N; k++){
        block[k] = []
        for(var l = 0; l < this.N; l++){
          var aiu = i*this.N+k
          var ueo = j*this.N+l
          block[k].push(array2d[i * this.N + k][j * this.N + l])
        }
      }
      blocks4d[i].push(block)
    }
  }
  return blocks4d
}

DCTImage.prototype.getSpectrum4d = function(){
  var blocks4d = this.blocks4d
  var width = blocks4d.length
  var spectrum4d = []

  for(var i = 0; i < width; i++){
    spectrum4d[i] = []
    for(var j = 0; j < width; j++){
      spectrum4d[i][j] = this.dct.dct2(blocks4d[i][j])
    }
  }

  return spectrum4d
}

DCTImage.prototype.getJPEG2d = function(){
  var spectrum4d = this.getSpectrum4d()
  var width = spectrum4d.length
  var idct4d = []

  for(var i = 0; i < width; i++){
    idct4d[i] = []
    for(var j = 0; j < width; j++){
      idct4d[i][j] = this.dct.idct2(spectrum4d[i][j])
      //this.compress(this.dct.idct2(spectrum4d[i][j]))
    }
  }

  var idct2d = []
  var width2d = this.raw2d.length

  for(var i = 0; i < width2d; i++){
    idct2d[i] = []
  }

  for(var i = 0; i < width2d / this.N; i++){
    for(var j = 0; j < width2d / this.N; j++){
      for(var k = 0; k < this.N; k++){
        idct2d[k + this.N * i] = idct2d[k + this.N * i].concat(idct4d[i][j][k])
      }
    }
  }

  return idct2d
}

DCTImage.prototype.compress = function(){
  //JPEG圧縮
  //ジグザグスキャン？
}

var drawBitmapToCanvas = function(canvas, ctx, pixel) {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var width = imageData.width, height = imageData.height;
  var pixels = imageData.data;  // ピクセル配列：RGBA4要素で1ピクセル
  for (var y = 0; y < pixel.length; ++y) {
    for (var x = 0; x < pixel.length; ++x) {
      var base = (y * width + x) * 4;
      var brightness = pixel[y][x]
      pixels[base + 0] = brightness;  // Red
      pixels[base + 1] = brightness;  // Green
      pixels[base + 2] = brightness;  // Blue
      pixels[base + 3] = 255;  // Alpha
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function toText(array) {
  var txt = ''
  for(var i = 0; i < array.length; i++){
    txt += array[i] + ","
  }
  return txt
}

// Initialize
var rcanvas = document.getElementById('rawcanvas')
var rctx = rcanvas.getContext('2d')
var ccanvas = document.getElementById('cmpcanvas')
var cctx = ccanvas.getContext('2d')

var N = 8

var raw2d = []
while(raw1d.length) raw2d.push(raw1d.splice(0,160));

var image = new DCTImage(N, raw2d)
var cmp = image.getJPEG2d()

drawBitmapToCanvas(rcanvas, rctx, raw2d)
drawBitmapToCanvas(ccanvas, cctx, cmp)
