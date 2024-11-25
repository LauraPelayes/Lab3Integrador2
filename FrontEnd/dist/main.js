"use strict";
/*import { jsPDF } from 'jspdf';
import 'jspdf-autotable';



declare module 'jspdf' {
    interface jsPDF {
    autoTable: (options: any) => void;
    }
}

console.log("jspdf",jsPDF);
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    const displayPedidos = (pedidosList) => {
        const tbody = document.querySelector('#pedidosTable tbody');
        if (!tbody)
            throw new Error('No se encontró el tbody en la tabla de pedidos');
        tbody.innerHTML = '';
        if (!Array.isArray(pedidosList)) {
            pedidosList = Array.of(pedidosList);
            console.log("PEDIDOSLIST", pedidosList);
        }
        pedidosList.forEach((pedido) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-4 border">${pedido.id}</td>
                <td class="p-4 border">${pedido.cliente.id}</td>
                <td class="p-4 border">${new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                <td class="p-4 border">${pedido.nroComprobante}</td>
                <td class="p-4 border">${pedido.formaPago}</td>
                <td class="p-4 border">${pedido.observaciones}</td>
                <td class="p-4 border">${pedido.totalPedido}</td>
                <td class="p-4 border">
                    <button class="p-2 bg-gray-200" onclick="testing()">Editar</button>
                    <button class="p-2 bg-gray-200" onclick="generatePdf(${pedido.id})">PDF</button>
                    <button class="p-2 bg-gray-200" onclick="deletePedidoById(${pedido.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    };
    const getPedidos = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3001/api/getAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok)
            throw new Error('Error al obtener pedidos');
        const data = yield response.json();
        return data.allPedidos;
    });
    const getPedidosByDate = (dates) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:3001/api/getPedidosByDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dates }),
        });
        if (!response.ok)
            throw new Error('Error al obtener pedidos por fecha');
        const data = yield response.json();
        return data.pedidosByDate;
    });
    const searchByIdForm = document.getElementById('searchByIdForm');
    searchByIdForm.onsubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const idToSearch = searchByIdForm.querySelector('input').value;
        const pedidos = yield getPedidos(idToSearch);
        displayPedidos(pedidos);
    });
    const searchByDatesForm = document.getElementById('searchByDates');
    searchByDatesForm.onsubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const fromDate = searchByDatesForm.querySelector('input#from').value;
        const toDate = searchByDatesForm.querySelector('input#to').value;
        const pedidos = yield getPedidosByDate({ fromDate, toDate });
        displayPedidos(pedidos);
    });
    const editPedidoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const popUp = document.getElementById('editPop');
        const closeModal = popUp.querySelector('#closePop');
        const form = popUp.querySelector('#editPedidoForm');
        if (!popUp || !form || !closeModal)
            throw new Error('No se encontró el formulario de edición o el modal');
        popUp.classList.remove('hidden');
        const idClienteInput = form.querySelector('input#idcliente');
        const fechaPedidoInput = form.querySelector('input#fechaPedido');
        const nroComprobanteInput = form.querySelector('input#nroComprobante');
        const formaPagoInput = form.querySelector('input#formaPago');
        const observacionesInput = form.querySelector('textarea#observaciones');
        const totalPedidoInput = form.querySelector('input#totalPedido');
        // Obtener datos actuales del pedido
        const idCliente = document.querySelector(`#idcliente[data-id="${id}"]`).textContent;
        const fechaPedido = document.querySelector(`#fechaPedido[data-id="${id}"]`).textContent;
        const nroComprobante = document.querySelector(`#nroComprobante[data-id="${id}"]`).textContent;
        const formaPago = document.querySelector(`#formaPago[data-id="${id}"]`).textContent;
        const observaciones = document.querySelector(`#observaciones[data-id="${id}"]`).textContent;
        const totalPedido = document.querySelector(`#totalPedido[data-id="${id}"]`).textContent;
        idClienteInput.value = idCliente || '';
        fechaPedidoInput.value = fechaPedido || '';
        nroComprobanteInput.value = nroComprobante || '';
        formaPagoInput.value = formaPago || '';
        observacionesInput.value = observaciones || '';
        totalPedidoInput.value = totalPedido || '';
        form.onsubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            const updatedPedido = {
                idcliente: idClienteInput.value,
                fechaPedido: fechaPedidoInput.value,
                nroComprobante: nroComprobanteInput.value,
                formaPago: formaPagoInput.value,
                observaciones: observacionesInput.value,
                totalPedido: totalPedidoInput.value,
            };
            const response = yield fetch(`http://localhost:3001/api/editPedido/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPedido),
            });
            if (!response.ok)
                throw new Error('Error al editar el pedido');
            popUp.classList.add('hidden');
            window.location.reload();
        });
        closeModal.onclick = () => {
            popUp.classList.add('hidden');
        };
    });
    const deletePedidoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
        if (!confirm(`¿Estás seguro de eliminar el pedido con ID ${id}?`))
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/deletePedido/${id}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                const errorData = yield response.json();
                throw new Error(errorData.message || 'Error al eliminar el pedido.');
            }
            alert('Pedido eliminado lógicamente.');
            const pedidos = yield getPedidos(''); // Actualiza la tabla
            displayPedidos(pedidos);
        }
        catch (error) {
            console.error('Error al eliminar el pedido:', error);
            alert('Error al eliminar el pedido.');
        }
    });
    /*
        const generatePdf = async (pedidoId: number) => {
            const response = await fetch(`http://localhost:3001/api/getAll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: pedidoId }),
            });
    
            if (!response.ok) throw new Error('Error al generar el PDF');
            const pedido = await response.json();
    
            const detallesResponse = await fetch(`http://localhost:3001/api/getDetallesById/${pedidoId}`);
            if (!detallesResponse.ok) throw new Error('Error al obtener detalles del pedido');
            const detalles = await detallesResponse.json();
    
            const doc = new jsPDF();
    
            doc.setFontSize(16);
            doc.text(`Pedido ID: ${pedidoId}`, 10, 10);
    
            doc.setFontSize(12);
            doc.text(`Cliente ID: ${pedido.allPedidos[0].idcliente}`, 10, 20);
            doc.text(`Fecha: ${pedido.allPedidos[0].fechaPedido}`, 10, 30);
    
            doc.autoTable({
                startY: 40,
                head: [['Producto', 'Cantidad', 'Subtotal']],
                body: detalles.detalles.map((detalle: Detalle) => [
                    detalle.producto,
                    detalle.cantidad,
                    `$${detalle.subtotal}`,
                ]),
            });
    
            doc.save(`Pedido_${pedidoId}.pdf`);
        };
    */
    try {
        const pedidos = yield getPedidos('');
        displayPedidos(pedidos);
    }
    catch (error) {
        console.error('Error al cargar los pedidos:', error);
    }
});
const testing = () => {
    console.log("Testeando...");
};
