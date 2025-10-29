// VARIABLES GLOBALES
// Estas variables almacenan el estado de la aplicación
let saldo = 0;                    // Saldo actual de la cuenta
let movimientos = [];             // Array para guardar todas las transacciones
let totalDepositado = 0;          // Suma total de todos los depósitos
let totalRetirado = 0;            // Suma total de todos los retiros
let numOperaciones = 0;           // Contador de operaciones realizadas

// INICIALIZACIÓN
// Este evento se ejecuta cuando el HTML está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cuando la página termina de cargar, actualizamos la interfaz
    actualizarInterfaz();
});

// FUNCIÓN PARA MOSTRAR ALERTAS
function mostrarAlerta(mensaje, tipo) {
    // Obtiene el elemento HTML donde se mostrarán las alertas
    const alert = document.getElementById('alert');
    
    // Establece el texto del mensaje
    alert.textContent = mensaje;
    
    // Reinicia las clases CSS del elemento
    alert.className = 'alert';
    
    // Aplica la clase CSS según el tipo de alerta
    if (tipo === 'error') {
        alert.classList.add('alert-error');  // Clase para errores (rojo)
    } else if (tipo === 'success') {
        alert.classList.add('alert-success'); // Clase para éxito (verde)
    }
    
    // Hace visible la alerta
    alert.style.display = 'block';
    
    // Programa ocultar la alerta después de 5 segundos (5000 milisegundos)
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

// FUNCIÓN PARA REALIZAR DEPÓSITO
function realizarDeposito() {
    // Obtiene los elementos HTML de los campos de entrada
    const montoInput = document.getElementById('monto');
    const conceptoInput = document.getElementById('concepto');
    
    // Convierte el valor del monto a número decimal
    const monto = parseFloat(montoInput.value);
    // Obtiene el concepto o usa 'Depósito' como valor por defecto
    const concepto = conceptoInput.value || 'Depósito';
    
    // VALIDACIÓN: Verifica si el monto es un número válido y positivo
    if (isNaN(monto) || monto <= 0) {
        mostrarAlerta('Por favor ingrese un monto válido', 'error');
        return; // Detiene la función si la validación falla
    }
    
    // ACTUALIZACIÓN DE DATOS:
    saldo += monto;              // Aumenta el saldo
    totalDepositado += monto;    // Aumenta el total depositado
    numOperaciones++;            // Incrementa el contador de operaciones
    
    // Crea un objeto con los datos del movimiento
    const movimiento = {
        tipo: 'deposito',        // Tipo de operación
        monto: monto,            // Cantidad de dinero
        concepto: concepto,      // Descripción
        fecha: new Date().toLocaleString() // Fecha y hora actual formateada
    };
    
    // Agrega el movimiento al inicio del array (para mostrar los más recientes primero)
    movimientos.unshift(movimiento);
    
    // Actualiza la interfaz con los nuevos datos
    actualizarInterfaz();
    
    // Muestra mensaje de éxito
    mostrarAlerta(`Depósito de $${monto} realizado con éxito`, 'success');
    
    // LIMPIEZA DEL FORMULARIO:
    montoInput.value = '';       // Vacía el campo de monto
    conceptoInput.value = '';    // Vacía el campo de concepto
}

// FUNCIÓN PARA REALIZAR RETIRO
function realizarRetiro() {
    // Obtiene los elementos HTML de los campos de entrada
    const montoInput = document.getElementById('monto');
    const conceptoInput = document.getElementById('concepto');
    
    // Convierte el valor del monto a número decimal
    const monto = parseFloat(montoInput.value);
    // Obtiene el concepto o usa 'Retiro' como valor por defecto
    const concepto = conceptoInput.value || 'Retiro';
    
    // VALIDACIÓN 1: Verifica si el monto es válido
    if (isNaN(monto) || monto <= 0) {
        mostrarAlerta('Por favor ingrese un monto válido', 'error');
        return; // Detiene la función si la validación falla
    }
    
    // VALIDACIÓN 2: Verifica si hay saldo suficiente
    if (saldo < monto) {
        mostrarAlerta('Saldo insuficiente para realizar el retiro', 'error');
        return; // Detiene la función si no hay saldo suficiente
    }
    
    // ACTUALIZACIÓN DE DATOS:
    saldo -= monto;              // Reduce el saldo
    totalRetirado += monto;      // Aumenta el total retirado
    numOperaciones++;            // Incrementa el contador de operaciones
    
    // Crea un objeto con los datos del movimiento
    const movimiento = {
        tipo: 'retiro',          // Tipo de operación
        monto: monto,            // Cantidad de dinero
        concepto: concepto,      // Descripción
        fecha: new Date().toLocaleString() // Fecha y hora actual formateada
    };
    
    // Agrega el movimiento al inicio del array
    movimientos.unshift(movimiento);
    
    // Actualiza la interfaz con los nuevos datos
    actualizarInterfaz();
    
    // Muestra mensaje de éxito
    mostrarAlerta(`Retiro de $${monto} realizado con éxito`, 'success');
    
    // LIMPIEZA DEL FORMULARIO:
    montoInput.value = '';       // Vacía el campo de monto
    conceptoInput.value = '';    // Vacía el campo de concepto
}

// FUNCIÓN PARA ACTUALIZAR TODA LA INTERFAZ
function actualizarInterfaz() {
    // ACTUALIZAR SALDO
    // toFixed(2) formatea el número con 2 decimales
    document.getElementById('saldoActual').textContent = `$${saldo.toFixed(2)}`;
    
    // ACTUALIZAR ESTADÍSTICAS
    document.getElementById('totalDepositado').textContent = `$${totalDepositado.toFixed(2)}`;
    document.getElementById('totalRetirado').textContent = `$${totalRetirado.toFixed(2)}`;
    document.getElementById('numOperaciones').textContent = numOperaciones;
    
    // ACTUALIZAR LISTA DE MOVIMIENTOS
    const movimientosList = document.getElementById('movimientosList');
    
    // Si no hay movimientos, muestra el estado vacío
    if (movimientos.length === 0) {
        movimientosList.innerHTML = `
            <div class="empty-state">
                <p>No hay transacciones registradas</p>
                <p>Realice su primera operación para comenzar</p>
            </div>
        `;
        return; // Termina la función aquí
    }
    
    // Si hay movimientos, los muestra en la lista
    movimientosList.innerHTML = movimientos.map(movimiento => `
        <div class="transaction-item">
            <div>
                <div class="transaction-type ${movimiento.tipo === 'deposito' ? 'transaction-deposito' : 'transaction-retiro'}">
                    ${movimiento.tipo === 'deposito' ? 'Depósito' : 'Retiro'} - ${movimiento.concepto}
                </div>
                <div style="font-size: 0.8em; color: #6c757d;">${movimiento.fecha}</div>
            </div>
            <div class="transaction-amount ${movimiento.tipo === 'deposito' ? 'transaction-deposito' : 'transaction-retiro'}">
                ${movimiento.tipo === 'deposito' ? '+' : '-'}$${movimiento.monto.toFixed(2)}
            </div>
        </div>
    `).join(''); // join('') convierte el array en un string HTML
}
