let fs = require("fs");
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = "inA";
let ARCHIVO_ESCRITURA = "outA";

/**
 * Método para realizar la lectura del problema, no modificar.
 */
async function input() {
  let line = 0;
  let readData = "";
  const readLine = () => {
    let inputLine = readData[line];
    line++;
    return inputLine;
  };
  return new Promise((resolve, reject) => {
    fs.readFile(ARCHIVO_LECTURA + ".txt", "utf-8", async (err, data) => {
      if (err) {
        reject(err);
      } else {
        readData = data.split("\n").map((e) => e.replace("\r", ""));
        let n = parseInt(readLine());
        let p = [];

        for (let i = 0; i < n; ++i) {
          let linea = readLine();
          let data = linea.split(" ");
          let horas = data[1].split("-");
          let horaI, minI, horaF, minF;
          let tiempo = horas[0].split(":");
          horaI = parseInt(tiempo[0]);
          minI = parseInt(tiempo[1]);
          tiempo = horas[1].split(":");
          horaF = parseInt(tiempo[0]);
          minF = parseInt(tiempo[1]);
          p.push(
            new Procedimiento(
              data[0],
              new Hora(horaI, minI),
              new Hora(horaF, minF)
            )
          );
        }
        resolve(p);
      }
    });
  });
}
/**
 * Método para realizar la escritura de la respuesta del problema, no modificar.
 */
async function output(obj) {
  let out = obj.n + "\n";
  out += obj.tiempoTotal + "\n";
  for (let i = 0; i < obj.n; ++i) {
    out += obj.nombreProcedimientos[i] + "\n";
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(ARCHIVO_ESCRITURA + ".txt", out, (err, list) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}

/**
 * Implementar el algoritmo y devolver un objeto de tipo Respuesta, el cual servirá
 * para imprimir la solución al problema como se requiere en el enunciado.
 */
async function solve(n, procedimientos) {
  let i = 0,
    u = 0,
    j = 1,
    c = 0;
  let procecitos = [];
  let arrproces = [];

  procedimientos.forEach(function (elemento, indice, array) {
    console.log(elemento, indice);
  });

  /* 
    console.log(i + " I");
    console.log(j + " J");
    console.log(u + " U");
    console.log("-------");
  */

  while (true) {
    if (j == procedimientos.length) {
      procecitos.unshift(procedimientos[u].nombre);
      arrproces.push(procecitos.slice());
      arrproces.forEach(function (elemento, indice) {
        console.log(elemento, indice);
      });
      procecitos.splice(0, procecitos.length);
      u += 1;
      i = u;
      j = i;
    }

    if (u == procedimientos.length) {
      procecitos.unshift(procedimientos[u - 1].nombre);
      arrproces.push(procecitos.slice());
      console.log(arrproces[0][0] + "Funciona");
      procecitos.splice(0, procecitos.length - 1);
      c = sumaproces(arrproces);
      return new Respuesta(c, new Hora(0, 0), arrproces); // revisar arrproces
    }

    if (procedimientos[i].horaFin.hora < procedimientos[j].horaInicio.hora) {
      procecitos.push(procedimientos[j].nombre);
      i = j;
      j++;
    } else if (
      procedimientos[i].horaFin.hora == procedimientos[j].horaInicio.hora
    ) {
      if (
        procedimientos[i].horaFin.minutos <=
        procedimientos[j].horaInicio.minutos
      ) {
        procecitos.push(procedimientos[j].nombre);
        i = j;
        j++;
      }
    } else {
      j++;
    }
  }
}

async function main() {
  const p = await input();
  let res = await solve(p.length, p);
  await output(res);
}

function MayorProce(procedimientos = [], arrproces = []) {
  let mayortiempo = [];
  let numeroPro = 0;
  let primera = 0,
    ultima = 0;
  for (let index = 0; index < arrproces.length; index++) {
    for (let finx = 0; finx < arrproces[index].length; finx++) {
      primera =
        procedimientos[procedimientos.indexOf(arrproces[index][finx])]
          .horaInicio.hora;
      ultima =
        procedimientos[procedimientos.indexOf(arrproces[index][finx])].horaFin
          .hora;
      numeroPro += ultima - primera;
    }
    mayortiempo.push(numeroPro);
  }
  mayortiempo.sort(function (a, b) {
    return a - b;
  });

  return mayortiempo[mayortiempo.length - 1];
}

function Respuesta(n, tiempoTotal, nombreProcedimientos) {
  this.n = n;
  this.tiempoTotal = tiempoTotal;
  this.nombreProcedimientos = nombreProcedimientos;
}

function Procedimiento(nombre, horaInicio, horaFin) {
  this.nombre = nombre;
  this.horaInicio = horaInicio;
  this.horaFin = horaFin;
}

function sumaproces(array = []) {
  let mayor = array[0].length;
  for (let index = 1; index < array.length; index++) {
    if (array[index].length > mayor) {
      mayor = array[index].length - 1;
    }
  }
  return mayor;
}

class Hora {
  constructor(hora, minutos) {
    this.hora = hora;
    this.minutos = minutos;
  }
  toString() {
    let res = "";
    if (this.hora < 10) res += "0" + this.hora;
    else res += this.hora;
    res += ":";
    if (this.minutos < 10) res += "0" + this.minutos;
    else res += this.minutos;
    return res;
  }
}
main();
