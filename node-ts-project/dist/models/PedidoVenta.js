var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from '../db.js';
export default class PedidoVenta {
    constructor(id, idCliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido) {
        this.id = id;
        this.idCliente = idCliente;
        this.fechaPedido = fechaPedido;
        this.nroComprobante = nroComprobante;
        this.formaPago = formaPago;
        this.observaciones = observaciones;
        this.totalPedido = totalPedido;
    }
    // Métodos para interactuar con la base de datos
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // Realiza la consulta para obtener el pedido por ID
            const pedidos = pool.query('SELECT * FROM pedido_venta');
            console.log("Pedidos", pedidos);
            return pedidos;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Realiza la consulta para obtener el pedido por ID
            const pedido = yield pool.query('SELECT * FROM pedido_venta WHERE id = ?', [id]);
            return pedido;
        });
    }
    static editById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cambios = yield pool.query(`UPDATE pedido_venta
				 SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?
				 WHERE id = ?`, [data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido, id]);
                console.log("Resultados del Query: ", cambios);
                return cambios;
            }
            catch (e) {
                return e;
            }
        });
    }
}
