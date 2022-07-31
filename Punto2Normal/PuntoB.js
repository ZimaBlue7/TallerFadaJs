const { Console } = require("console");
let fs = require("fs");
/**
 * Nombres de los archivos de lectura y escritura, modifique como considere.
 */
let ARCHIVO_LECTURA = "inB";
let ARCHIVO_ESCRITURA = "outB";

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
        let [n, m] = readLine()
          .split(" ")
          .map((e) => parseInt(e));
        let libros = [];
        for (let i = 0; i < m; ++i) {
          let data = readLine().split(" ");
          let nombre = data[0];
          let paginas = parseInt(data[1]);
          libros.push(new Libro(nombre, paginas));
        }
        resolve(new Entrada(n, m, libros));
      }
    });
  });
}
/**
 * Método para realizar la escritura de la respuesta del problema, no modificar.
 */
async function output(obj) {
  let out = obj.tiempoTotal + "\n";
  for (let i = 0; i < obj.libroQueEmpieza.length; ++i) {
    out += obj.libroQueEmpieza[i] + " " + obj.libroQueTermina[i] + "\n";
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
async function solve(n, m, libros) {
  var sumaPaginas = 0; // inicializacion de la variable
  let dias = []; // dias totales
  for (let f = 0; f < libros.length; f++) {
    sumaPaginas += libros[f].paginas; // Suma de todas las paginas de los libros
  }
  let ppe = Math.floor(sumaPaginas / n); // paginas por escritor
  let escritor = []; // paginas por escritor en arreglos
  let escritorPs = []; // arreglo: indices de posicion libros por escritor
  let ordenPaginas = []; // libros ordenados

  for (let g = 0; g < n; g++) {
    escritor[g] = ppe;
  }
  let diferencia = sumaPaginas - (ppe * n - 1);

  for (let index = 0; index < libros.length; index++) {
    ordenPaginas.push(libros[index].paginas);
  }

  ordenPaginas.sort(function (a, b) {
    return a - b;
  });
  ordenPaginas.unshift(ordenPaginas[ordenPaginas.length - 1]);
  ordenPaginas.pop();

  let i = 0,
    j = 0,
    k = 0,
    u = 0;

  const primerlibrito = [];
  const ultimolibrito = [];

  /* ordenPaginas.forEach(function(elemento, indice, array) {
        console.log(elemento, indice);
    }) */

  while (true) {
    /* console.log(i+": I");
        console.log(j+": J"); */
    if (n == m) {
      for (let index = 0; index < escritor.length; index++) {
        escritorPs.push(new EscritorP("libro " + index, "- libro " + index));
      }
      for (let l = 0; l < escritor.length; l++) {
        primerlibrito.push(escritorPs[l].primerLibro);
        ultimolibrito.push(escritorPs[l].ultimoLibro);
      }
      return new Respuesta(ordenPaginas[0], primerlibrito, ultimolibrito);
    }

    if (escritor[i] - ordenPaginas[j] >= -diferencia) {
      //console.log(escritor[i]+": Escritor "+ordenPaginas[j]+": Pagina");
      escritor[i] -= ordenPaginas[j];
      u = j;
      j++;
    } else {
      //console.log(escritor[i]+": Escritor "+ordenPaginas[j]+": Pagina else");
      if ((i == n - 1 && j == m - 1) || (i == 0 && j == 0)) {
        if (i == n - 1) {
          u++;
        }
        escritorPs.push(new EscritorP("libro " + k, "- libro " + u));
        dias.push(sumadias(k, u, ordenPaginas));
        i++;
        k = u + 1;
        j++;
      } else {
        escritorPs.push(new EscritorP("libro " + k, "- libro " + u));
        dias.push(sumadias(k, u, ordenPaginas));
        i++;
        k = u + 1;
      }

      if (j == m) {
        if (escritorPs[j - 1] == null) {
          escritorPs.push(new EscritorP("libro " + 0, "- libro " + 0));
        }

        for (let z = 0; z < escritor.length; z++) {
          primerlibrito.push(escritorPs[z].primerLibro);
          ultimolibrito.push(escritorPs[z].ultimoLibro);
        }
        dias.sort(function (a, b) {
          return a - b;
        });

        return new Respuesta(
          dias[dias.length - 1],
          primerlibrito,
          ultimolibrito
        );
      }
    }
  }
}
async function main() {
  console.time("t1");
  const inp = await input();
  let res = await solve(inp.n, inp.m, inp.libros);
  await output(res);
  console.timeEnd("t1");
}

function Entrada(n, m, libros) {
  this.n = n;
  this.m = m;
  this.libros = libros;
}
function Libro(nombre, paginas) {
  this.nombre = nombre;
  this.paginas = paginas;
}

function EscritorP(primerLibro, ultimoLibro) {
  this.primerLibro = primerLibro;
  this.ultimoLibro = ultimoLibro;
}

function sumadias(a, b, array = []) {
  let sumita = 0;
  while (true) {
    if (a > b) {
      return sumita;
    }
    sumita += array[a];
    a++;
  }
}

function Respuesta(tiempoTotal, libroQueEmpieza, libroQueTermina) {
  this.tiempoTotal = tiempoTotal;
  /**
   * Esta variable contiene en su posición i, el nombre del libro por el que empieza el i-ésimo
   * escritor.
   */
  this.libroQueEmpieza = libroQueEmpieza;
  /**
   * Esta variable contiene en su posición i, el nombre del libro por el que termina el i-ésimo
   * escritor.
   */
  this.libroQueTermina = libroQueTermina;
}

main();
