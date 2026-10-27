function calculadora(seg, fps) {
  return seg * fps;
}
let total;
let seg = Number(prompt("Ingrese la canridad de segundos:"));
let fps = Number(prompt("Ingrese la cantidad de fps:"));
area = calcularArea(seg, fps);
alert(seg + " segundos × " + fps +" FPS = " + total + " fotogramas");
