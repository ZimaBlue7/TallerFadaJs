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
    j = 1;
  let procecitos = [];
  let arrproces = [];

  procedimientos.forEach(function (elemento, indice, array) {
    console.log(elemento, indice);
  });

  while (true) {
    if (j == procedimientos.length) {
      procecitos.unshift(procedimientos[u]);
      arrproces.push(procecitos.slice());
      procecitos.splice(0, procecitos.length);
      u += 1;
      i = u;
      j = i;
    }

    if (u == procedimientos.length) {
      procecitos.unshift(procedimientos[u - 1]);
      arrproces.push(procecitos.slice());
      procecitos.splice(0, procecitos.length - 1);

      let final = MayorProce(arrproces);
      let arreglo = [];
      for (let index = 0; index < arrproces[final.index].length; index++) {
        arreglo.push(arrproces[final.index][index].nombre);
      }

      return new Respuesta(
        arrproces[final.index].length,
        new Hora(final.horas, final.minutos),
        arreglo
      ); 
    }

    if (procedimientos[i].horaFin.hora < procedimientos[j].horaInicio.hora) {
      procecitos.push(procedimientos[j]);
      i = j;
      j++;
    } else if (
      procedimientos[i].horaFin.hora == procedimientos[j].horaInicio.hora
    ) {
      if (
        procedimientos[i].horaFin.minutos <=
        procedimientos[j].horaInicio.minutos
      ) {
        procecitos.push(procedimientos[j]);
        i = j;
        j++;
      } else {
        j++;
      }
    } else {
      j++;
    }
  }
}

async function main() {
  console.time("t1");
  const p = await input();
  let res = await solve(p.length, p);
  await output(res);
  console.timeEnd("t1");
}

function MayorProce(arrproces = []) {
  let mayortiempo = [];
  let horas = 0,
    minutos = 0;
  let datos;

  for (let index = 0; index < arrproces.length; index++) {
    //console.log("cambia index");
    for (let finx = 0; finx < arrproces[index].length; finx++) {
      //console.log("cambia finx");
        datos = arrproces[index][finx];
          if (datos.horaInicio.minutos == 0 && datos.horaFin.minutos == 0) {
            horas += datos.horaFin.hora - datos.horaInicio.hora;
            minutos = 0;
          } else if (
            datos.horaInicio.minutos == 30 &&
            datos.horaFin.minutos == 0
          ) {
            horas += datos.horaFin.hora - 1 - datos.horaInicio.hora;
            minutos += 30;
          } else if (
            datos.horaInicio.minutos == 0 &&
            datos.horaFin.minutos == 30
          ) {
            horas += datos.horaFin.hora - datos.horaInicio.hora;
            minutos += 30;
          } else {
            horas += datos.horaFin.hora - datos.horaInicio.hora;
            minutos = 0;
          }
    }
    if (minutos % 60 == 0) {
      horas += minutos / 60;
      minutos = 0;
    } else {
      horas += Math.trunc(minutos / 60);
      minutos = 30;
    }
    mayortiempo.push(new Pos(horas, minutos, index));
    horas = 0;
    minutos = 0;
  }
  let mayorcito = 0;
  let mayorhora = 0;
  for (let j = 0; j < mayortiempo.length; j++) {
    if (mayortiempo[j].horas >= mayorhora) {
      mayorhora = mayortiempo[j].horas;
      mayorcito = mayortiempo[j].index;
    }
  } 
  return mayortiempo[mayorcito];
}

function Pos(horas, minutos, index) {
  this.horas = horas;
  this.minutos = minutos;
  this.index = index;
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
