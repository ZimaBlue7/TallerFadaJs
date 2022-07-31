"""
Nombres de los archivos de lectura y escritura, modifique como considere.
 """
import time
nombreLectura = "Test8"
nombreEscritura = "outB"


class Entrada():
    def __init__(self, n, m, libros):
        self.n = n
        self.m = m
        self.libros = libros


class Respuesta():
    def __init__(self, tiempoTotal, libroQueEmpieza):
        self.tiempoTotal = tiempoTotal
        self.libroQueEmpieza = libroQueEmpieza


class Libro():
    def __init__(self, nombre, paginas):
        self.nombre = nombre
        self.paginas = paginas


def input():
    '''
    Método para realizar la lectura del problema, no modificar.
    '''
    readData = []
    line = 0

    def readLine(line):
        inputLine = readData[line]
        return inputLine

    with open(nombreLectura+".txt", "r") as f:
        readData = f.read().split('\n')
        data = readLine(line).split(" ")
        n = int(data[0])
        m = int(data[1])
        line += 1
        libros = []
        for i in range(m):
            data = readLine(line).split(" ")
            nombre = data[0]
            paginas = int(data[1])
            libros.append(Libro(nombre, paginas))
            line += 1
        return Entrada(n, m, libros)


def output(obj):
    '''
    Método para realizar la escritura de la respuesta del problema, no modificar.
    '''
    out = str(obj.tiempoTotal) + "\n"
    for i in range(len(obj.libroQueEmpieza)):
        out += obj.libroQueEmpieza[i] + " " + "\n"

    with open(nombreEscritura+".txt", "w") as f:
        f.write(out)


def solve(n, m, libros):

    pages = []

    for obj in libros:
        pages.append(obj.paginas)
    # numberP devuelve el número máximo de páginas que un escritor tiene que copiar.

    def numberP(asignacion):
        max_pages = -1
        for escritor in asignacion:
            max_pages = max(max_pages, sum([pages[book] for book in escritor]))

        return max_pages

    # La función repartir devuelve la asignación como una lista donde el i-ésimo elemento es una lista de índices de libros asignados al i-ésimo escrito.
    def repartir(asignacion, escritor, book):

        if book == m:
            return numberP(asignacion), asignacion

        assign_actual = [x[:] for x in asignacion]

        assign_actual[escritor].append(book)

        actual = repartir(assign_actual, escritor, book + 1)

        if escritor == n - 1:
            return actual

        assign_next = [x[:] for x in asignacion]

        assign_next[escritor + 1].append(book)

        next = repartir(assign_next, escritor + 1, book + 1)

        return min(actual, next)

    initial_asignacion = [[] for x in range(n)]

    repartir(initial_asignacion, 0, 0)

    return Respuesta(repartir(initial_asignacion, 0, 0), ["(numero de dias, [escritor-->[libros que se le asinaron]]"])


def main():
    e = input()
    res = solve(e.n, e.m, e.libros)
    print(res)
    output(res)


if __name__ == "__main__":
    main()
