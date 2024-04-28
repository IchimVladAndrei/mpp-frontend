import {faker} from '@faker-js/faker';
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

export function generateMoreCars() {
    for (let i = 0; i < 1000; i++) {
        try {
            create(
                faker.vehicle.manufacturer(),
                faker.helpers.rangeToNumber({min: 1, max: 300}),
                faker.helpers.rangeToNumber({min: 1950, max: 2024}),
                //faker.helpers.rangeToNumber({min: 40, max: 10000}),
            );
        } catch (error) {
            console.log('duplicat');
        }
    }
}

export const create = async (brand, price, yearBought, dealer) => {
    const pool = await poolPromise;

    const didRes = await pool
        .request()
        .input('name', sql.VarChar(50), dealer)
        .query('SELECT did From Dealership WHERE name=@name');
    const did = didRes.recordset[0].did;

    try {
        await pool
            .request()
            .input('brand', sql.VarChar(50), brand)
            .input('price', sql.Int, price)
            .input('yearBought', sql.Int, yearBought)
            .input('did', sql.Int, did) //ID WILL BE DONE VIA SQL SERVER
            .query(
                'INSERT INTO Cars (brand,price,yearBought,did) VALUES (@brand,@price,@yearBought,@did)',
            );
    } catch (error) {
        // Check if the error is a duplicate record error
        if (error.number === 2601 || error.number === 2627) {
            console.log(
                'Duplicate record error occurred. Continuing execution.',
            );
        } else {
            throw error;
        }
    }
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
