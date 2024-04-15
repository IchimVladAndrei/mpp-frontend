import sql from 'mssql';
import {poolPromise} from '../config/databaseConfig.js';
export const read = async () => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .query('SELECT cid AS id, brand, price, yearBought FROM Cars');

    return res.recordset;
};

export const readById = async (id) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('cid', sql.Int, id)
        .query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE cid = @cid',
        );
    const rowsAffected = res.recordset.length > 0 ? 1 : 0;
    return [res.recordset[0], rowsAffected];
};

export const carByDID = async (did) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('did', sql.Int, did)
        .query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE did = @did',
        );
    const rowsAffected = res.recordset.length > 0 ? 1 : 0;
    return [res.recordset[0], rowsAffected];
};

export const deleter = async (id) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('cid', sql.Int, id)
        .query('DELETE FROM Cars WHERE cid = @cid');
    return res.rowsAffected;
};

export const create = async (brand, price, yearBought, dealer) => {
    const pool = await poolPromise;

    const didRes = await pool
        .request()
        .input('name', sql.VarChar(50), dealer)
        .query('SELECT did From Dealership WHERE name=@name');
    const did = didRes.recordset[0].did;

    await pool
        .request()
        .input('brand', sql.VarChar(50), brand)
        .input('price', sql.Int, price)
        .input('yearBought', sql.Int, yearBought)
        .input('did', sql.Int, did) //ID WILL BE DONE VIA SQL SERVER
        .query(
            'INSERT INTO Cars (brand,price,yearBought,did) VALUES (@brand,@price,@yearBought,@did)',
        ); //1 for now we will see how will be done with did
    //return res.rowsAffected; //how to return the created car?
    // Retrieve the inserted car's ID from the query result
    //const insertedId = res.recordset[0].cid;
    //console.log(insertedId + ' from sql');
    // Query the database to get the full details of the inserted car
    const maxIdRes = await pool
        .request()
        .query('SELECT MAX(cid) AS maxId FROM Cars');

    const lastId = maxIdRes.recordset[0].maxId;

    const insertedCarQuery = await pool
        .request()
        .input('cid', sql.Int, lastId)
        .query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE cid=@cid ',
        );

    // Return the first record (assuming only one car was inserted)
    return insertedCarQuery.recordset[0];
    //console.log(res.recordset[0]);
};

export const updater = async (id, brand, price, yearBought) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('cid', sql.Int, id)
        .input('brand', sql.VarChar(50), brand)
        .input('price', sql.Int, price)
        .input('yearBought', sql.Int, yearBought)
        .query(
            'UPDATE Cars SET brand=@brand, price=@price,yearBought=@yearBought WHERE cid=@cid',
        );
    // Fetch and return the updated car
    const {recordset} = await pool
        .request()
        .input('cid', sql.Int, id)
        .query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE cid = @cid',
        );

    // Return the first (and only) row from the recordset
    return [recordset[0], res.rowsAffected];
};
