
// Variables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')

// Eventos
eventListeners()
function eventListeners(){
    document.addEventListener('DOMContentLoades', preguntarPresupuesto)
    formulario.addEventListener('submit', agregarGasto)
}

// Clases

class Presupuesto{
constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
}

    nuevoGasto(gasto){
        this.gastos = [...this.gastos , gasto];
        this.calcularRestante();
    }

    calcularRestante(){ 
        const gastado = this.gastos.reduce((total,gasto) => total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        console.log(this.gastos)
        
        this.calcularRestante();
        formulario.querySelector('button[type="submit"]').disabled = false;
    }
}


class UI{
    insertarPresupuesto(cantidad){
        //Extrayendo los valores
        const {presupuesto, restante} = cantidad
        //Agrego al HTML
        document.querySelector('#mitotal').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo){
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center','alert');

        if(tipo === 'error'){
            divAlerta.classList.add('alert-danger')
        }else{
            divAlerta.classList.add('alert-success')
        }

        //Mensaje de Error
        divAlerta.textContent = mensaje;

        //Insertar en html
        document.querySelector('.primario').insertBefore(divAlerta,formulario)

        //Quitar Mensaje
        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }

    mostrarGasto(gastos){
        
        this.limparHTML();     // Eliminando html previo

        gastos.forEach(element => {
            // Destructuring con los valores que itero
            const { cantidad , nombre , id} = element;

            // Listo un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; //Boostrap
            nuevoGasto.setAttribute('data-id',id);

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = 
            `
                ${nombre}<span class="badge badge-primary badge-pill"> $${cantidad} </span>
            `;

            // Boton para agregar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn' , 'btn-danger','borrar-gasto')
            btnBorrar.textContent = 'x';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            //Imprimir todo al HTTML
            gastoListado.appendChild(nuevoGasto)

        });

        
    }

    limparHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestOBJ){
        const {restante} = presupuestOBJ ;

        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se agoto','error')
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instancias de clases
const ui = new UI();
let presupuesto;

// Funciones
preguntarPresupuesto();
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Indica tu presupuesto');
    console.log( Number(presupuestoUsuario ));

    // Si esta vacio O si doy cancelar y retorna null O si es un string y retorna NaN
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto)
}


function agregarGasto(e){
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)

    //Validacion
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error')
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error')
        return;
    }

    //Generando un objeto con el gasto
    const gasto = {nombre,cantidad , id:Date.now()} // Contrario al destructuring, ahora los uno o cancateno

    // Añandendo el obj a mi presupuesto gasto
    presupuesto.nuevoGasto(gasto)

    // Mensaje que salio bien
    ui.imprimirAlerta('Gasto agregado correctamente');

    //Imprimir los gastos , creo un nuevo metodo
    const {gastos , restante} = presupuesto;
    ui.mostrarGasto(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    
    // Reiniciando formulario
    formulario.reset();
}


function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos , restante} = presupuesto ;
    ui.mostrarGasto(gastos);
    ui.actualizarRestante(restante);
    
}