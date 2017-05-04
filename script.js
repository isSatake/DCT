/*
 *  Author: Hiroaki Satake (81724496)
 */


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
  return math.multiply(this.phMatrix, math.matrix(data))
}

DCT.prototype.idct = function(data){
  return math.multiply(math.transpose(this.phMatrix), math.matrix(data))._data
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
function DCTImage(n, level, array2d){
  this.N = n
  this.compLevel = level
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

  return this.compress(this.quantize(spectrum4d))
}

DCTImage.prototype.getJPEG2d = function(){
  var spectrum4d = this.iQuantize(this.getSpectrum4d())
  var width = spectrum4d.length
  var idct4d = []

  for(var i = 0; i < width; i++){
    idct4d[i] = []
    for(var j = 0; j < width; j++){
      idct4d[i][j] = this.dct.idct2(spectrum4d[i][j])
    }
  }

  return this.convert4to2(idct4d)
}

DCTImage.prototype.convert4to2 = function(array4d){
  var array2d = []
  var width2d = this.raw2d.length

  for(var i = 0; i < width2d; i++){
    array2d[i] = []
  }

  for(var i = 0; i < width2d / this.N; i++){
    for(var j = 0; j < width2d / this.N; j++){
      for(var k = 0; k < this.N; k++){
        array2d[k + this.N * i] = array2d[k + this.N * i].concat(array4d[i][j][k])
      }
    }
  }

  return array2d
}

DCTImage.prototype.quantize = function(array4d){
  var quantized4d = []
  var width2d = this.raw2d.length

  for(var i = 0; i < width2d / this.N; i++){
    quantized4d[i] = []
    for(var j = 0; j < width2d / this.N; j++){
      quantized4d[i][j] = []
      for(var k = 0; k < this.N; k++){
        quantized4d[i][j][k] = []
        for(var l = 0; l < this.N; l++) {
          quantized4d[i][j][k][l] = Math.floor(array4d[i][j][k][l] * qTable[k][l])
        }
      }
    }
  }

  return quantized4d
}

DCTImage.prototype.compress = function(array4d){
  var compressed4d = []
  var width2d = this.raw2d.length

  for(var i = 0; i < width2d / this.N; i++){
    compressed4d[i] = []
    for(var j = 0; j < width2d / this.N; j++){
      compressed4d[i][j] = []
      for(var k = 0; k < this.N; k++){
        compressed4d[i][j][k] = []
        for(var l = 0; l < this.N; l++) {
          compressed4d[i][j][k][l] = Math.floor(array4d[i][j][k][l] * cTable[this.compLevel][k][l])
        }
      }
    }
  }

  return compressed4d
}

DCTImage.prototype.iQuantize = function(array4d){
  var i4d = []
  var width2d = this.raw2d.length

  for(var i = 0; i < width2d / this.N; i++){
    i4d[i] = []
    for(var j = 0; j < width2d / this.N; j++){
      i4d[i][j] = []
      for(var k = 0; k < this.N; k++){
        i4d[i][j][k] = []
        for(var l = 0; l < this.N; l++) {
          i4d[i][j][k][l] = Math.floor(array4d[i][j][k][l] / qTable[k][l])
        }
      }
    }
  }

  return i4d
}

var drawBitmapToCanvas = function(canvas, ctx, pixel) {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var width = imageData.width, height = imageData.height;
  var pixels = imageData.data;
  for (var y = 0; y < pixel.length; ++y) {
    for (var x = 0; x < pixel.length; ++x) {
      var base = (y * width + x) * 4;
      var brightness = pixel[y][x]
      pixels[base + 0] = brightness;
      pixels[base + 1] = brightness;
      pixels[base + 2] = brightness;
      pixels[base + 3] = 255;
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

function changeLevel() {
  init(document.getElementById("complevel").value)
}

function init(level){
  var image = new DCTImage(N, level, raw2d)
  var spc = image.convert4to2(image.getSpectrum4d())
  var cmp = image.getJPEG2d()

  drawBitmapToCanvas(scanvas, sctx, spc)
  drawBitmapToCanvas(ccanvas, cctx, cmp)
}

var rcanvas = document.getElementById('rawcanvas')
var rctx = rcanvas.getContext('2d')
var scanvas = document.getElementById('spccanvas')
var sctx = scanvas.getContext('2d')
var ccanvas = document.getElementById('cmpcanvas')
var cctx = ccanvas.getContext('2d')

var N = 8

var raw2d = []
while(raw1d.length) raw2d.push(raw1d.splice(0,160));

drawBitmapToCanvas(rcanvas, rctx, raw2d)
init(7)
