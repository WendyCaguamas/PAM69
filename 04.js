let total = 0, promedio = 0;
for(i=1 ; i <= 5; i++){
    let num = Number(prompt("Ingresa el tamaño del archivo " + i + ":"));
    console.log("Archivo " + i + ":" + num + " MB");
    total = total + num; 
}
let prom = total / 5;
console.log("Total: " + total + " MB");
console.log("Promedio: " + prom + " MB");