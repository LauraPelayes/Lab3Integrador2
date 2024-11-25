// src/db.ts
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'negocio',
});

const conect = async () => {
  const conn = await pool.getConnection();
  console.log("Coneccion exitosa: ", conn)
} 
conect();

