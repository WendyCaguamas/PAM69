function calculadora(seg, fps) {
  return seg * fps;
}
let total;
let seg = Number(prompt("Ingrese la cantidad de segundos:"));
let fps = Number(prompt("Ingrese la cantidad de fps:"));
area = calculadora(seg, fps);
alert(seg + " segundos × " + fps +" FPS = " + total + " fotogramas");
