let pantalla = document.getElementById('pantalla');
let entradaActual = '';
let operacionActual = null;
let primerOperando = null;

function agregarNumero(numero) {
    if (entradaActual === '0' && numero === '0') return;
    entradaActual += numero;
    pantalla.value = entradaActual;
}

function agregarDecimal() {
    if (!entradaActual.includes('.')) {
        entradaActual += '.';
        pantalla.value = entradaActual;
    }
}

function seleccionarOperacion(operacion) {
    if (entradaActual === '') return;
    if (primerOperando !== null) {
        calcular();
    }
    primerOperando = parseFloat(entradaActual);
    operacionActual = operacion;
    entradaActual = '';
}

function calcular() {
    if (entradaActual === '' || operacionActual === null) return;
    let segundoOperando = parseFloat(entradaActual);
    let resultado;
    switch (operacionActual) {
        case '+':
            resultado = primerOperando + segundoOperando;
            break;
        case '-':
            resultado = primerOperando - segundoOperando;
            break;
        case '*':
            resultado = primerOperando * segundoOperando;
            break;
        case '/':
            resultado = primerOperando / segundoOperando;
            break;
        case '^':
            resultado = Math.pow(primerOperando, segundoOperando);
            break;
        default:
            return;
    }
    entradaActual = resultado;
    pantalla.value = resultado;
    primerOperando = null;
    operacionActual = null;
}

function limpiarPantalla() {
    entradaActual = '';
    operacionActual = null;
    primerOperando = null;
    pantalla.value = '0';
}

function reiniciarCalculadora() {
    entradaActual = '';
    operacionActual = null;
    primerOperando = null;
    pantalla.value = '0';
}
