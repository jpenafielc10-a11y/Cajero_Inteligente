// Variables globales
let saldo = 0;
let movimientos = [];
let totalDepositado = 0;
let totalRetirado = 0;
let numOperaciones = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    actualizarInterfaz();
});

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    const alert = document.getElementById('alert');
    alert.textContent = mensaje;
    alert.className = 'alert';
    
    if (tipo === 'error') {
        alert.classList.add('alert-error');
    } else if (tipo === 'success') {
        alert.classList.add('alert-success');
    }
    
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

// Función para realizar depósito
function realizarDeposito() {
    const montoInput = document.getElementById('monto');
    const conceptoInput = document.getElementById('concepto');
    
    const monto = parseFloat(montoInput.value);
    const concepto = conceptoInput.value || 'Depósito';
    
    if (isNaN(monto) || monto <= 0) {
        mostrarAlerta('Por favor ingrese un monto válido', 'error');
        return;
    }
    
    saldo += monto;
    totalDepositado += monto;
    numOperaciones++;
    
    const movimiento = {
        tipo: 'deposito',
        monto: monto,
        concepto: concepto,
        fecha: new Date().toLocaleString()
    };
    
    movimientos.unshift(movimiento);
    actualizarInterfaz();
    mostrarAlerta(`Depósito de $${monto} realizado con éxito`, 'success');
    
    // Limpiar formulario
    montoInput.value = '';
    conceptoInput.value = '';
}

// Función para realizar retiro
function realizarRetiro() {
    const montoInput = document.getElementById('monto');
    const conceptoInput = document.getElementById('concepto');
    
    const monto = parseFloat(montoInput.value);
    const concepto = conceptoInput.value || 'Retiro';
    
    if (isNaN(monto) || monto <= 0) {
        mostrarAlerta('Por favor ingrese un monto válido', 'error');
        return;
    }
    
    if (saldo < monto) {
        mostrarAlerta('Saldo insuficiente para realizar el retiro', 'error');
        return;
    }
    
    saldo -= monto;
    totalRetirado += monto;
    numOperaciones++;
    
    const movimiento = {
        tipo: 'retiro',
        monto: monto,
        concepto: concepto,
        fecha: new Date().toLocaleString()
    };
    
    movimientos.unshift(movimiento);
    actualizarInterfaz();
    mostrarAlerta(`Retiro de $${monto} realizado con éxito`, 'success');
    
    // Limpiar formulario
    montoInput.value = '';
    conceptoInput.value = '';
}

// Función para actualizar toda la interfaz
function actualizarInterfaz() {
    // Actualizar saldo
    document.getElementById('saldoActual').textContent = `$${saldo.toFixed(2)}`;
    
    // Actualizar estadísticas
    document.getElementById('totalDepositado').textContent = `$${totalDepositado.toFixed(2)}`;
    document.getElementById('totalRetirado').textContent = `$${totalRetirado.toFixed(2)}`;
    document.getElementById('numOperaciones').textContent = numOperaciones;
    
    // Actualizar lista de movimientos
    const movimientosList = document.getElementById('movimientosList');
    
    if (movimientos.length === 0) {
        movimientosList.innerHTML = `
            <div class="empty-state">
                <p>No hay transacciones registradas</p>
                <p>Realice su primera operación para comenzar</p>
            </div>
        `;
        return;
    }
    
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
    `).join('');
}