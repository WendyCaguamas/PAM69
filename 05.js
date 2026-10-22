let pesados;
for(i=1 ; i <= 8; i++){
    let num = Number(prompt("Ingresa el tamaño del archivo " + i + ":"));
    console.log("Archivo " + i + ":" + num + " MB");
    if(archivo > 100){ 
        pesados++;
    }
}
console.log("Tiene " + pesados + " archivos pesados de mas de 100 MB");
