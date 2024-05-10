import sql from 'mssql';
import {poolPromise} from '../config/databaseConfig.js';
export const userFind = async (email, pass) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('email', sql.VarChar(50), email)
        .input('pass', sql.VarChar(61), pass)
        .query(
            'SELECT uid AS id,email,isAdmin,name FROM Users WHERE email=@email AND pass=@pass',
        ); //DONT SELECT PASSWORD
    return res.recordset[0];
};

export const userByEmail = async (email) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('email', sql.VarChar(50), email)
        .query(
            'SELECT uid AS id,email,isAdmin,name,pass FROM Users WHERE email=@email',
        ); //DONT SELECT PASSWORD
    return res.recordset[0];
};
export const userCreate = async (name, email, pass) => {
    const pool = await poolPromise;
    await pool
        .request()
        .input('email', sql.VarChar(50), email)
        .input('name', sql.VarChar(50), name)
        .input('pass', sql.VarChar(61), pass)
        .query(
            'INSERT INTO Users (email, name, pass) VALUES (@email,@name,@pass)',
        );
    const maxID = await pool
        .request()
        .query('SELECT MAX(uid) as maxId FROM Users');
    const lastId = maxID.recordset[0].maxId;
    const insertedUser = await pool
        .request()
        .input('uid', sql.Int, lastId)
        .query('SELECT uid AS id,email,isAdmin,name FROM Users WHERE uid=@uid');
    return insertedUser.recordset[0];
};
