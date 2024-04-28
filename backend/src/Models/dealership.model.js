import {faker} from '@faker-js/faker';
import sql from 'mssql';
import {poolPromise} from '../config/databaseConfig.js';

export const read = async () => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .query('SELECT did AS id, name, location, reviews FROM Dealership');

    return res.recordset;
};

export const paginateDealers = async (did, page) => {
    const pool = await poolPromise;
    const myQuery = `
            SELECT cid AS id, brand, price, yearBought
            FROM Cars
            WHERE did = @did
            ORDER BY cid
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `;

    const pageSize = 50;
    const offset = (page - 1) * pageSize;
    const res = await pool
        .request()
        .input('did', sql.Int, did)
        .input('offset', sql.Int, offset)
        .input('pageSize', sql.Int, pageSize)
        .query(myQuery);
    return res.recordset;
};

export const readById = async (id) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('did', sql.Int, id)
        .query(
            'SELECT did AS id, name, location, reviews FROM Dealership WHERE did = @did',
        );
    const rowsAffected = res.recordset.length > 0 ? 1 : 0;
    return [res.recordset[0], rowsAffected];
};

export const deleter = async (id) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('did', sql.Int, id)
        .query('DELETE FROM Dealership WHERE did = @did');
    return res.rowsAffected;
};

export const generateThousandDealers = () => {
    for (let i = 0; i < 0; i++) {
        create(
            faker.company.name(),
            faker.location.city(),
            faker.helpers.rangeToNumber({min: 10, max: 49}) / 10,
        );
    }
};

export const create = async (name, location, reviews) => {
    const pool = await poolPromise;
    await pool
        .request()
        .input('name', sql.VarChar(50), name)
        .input('location', sql.VarChar(50), location)
        .input('reviews', sql.Decimal(3, 2), reviews) //ID WILL BE DONE VIA SQL SERVER
        .query(
            'INSERT INTO Dealership (name,location,reviews) VALUES (@name,@location,@reviews)',
        );
    const maxIdRes = await pool
        .request()
        .query('SELECT MAX(did) AS maxId FROM Dealership');

    const lastId = maxIdRes.recordset[0].maxId;

    const insertedDealerQuery = await pool
        .request()
        .input('did', sql.Int, lastId)
        .query(
            'SELECT did AS id, name,location,reviews FROM Dealership WHERE did=@did ',
        );

    return insertedDealerQuery.recordset[0];
};

export const updater = async (id, name, location, reviews) => {
    const pool = await poolPromise;
    const res = await pool
        .request()
        .input('did', sql.Int, id)
        .input('name', sql.VarChar(50), name)
        .input('location', sql.VarChar(50), location)
        .input('reviews', sql.Decimal(3, 2), reviews)
        .query(
            'UPDATE Dealership SET name=@name,location=@location,reviews=@reviews WHERE did=@did',
        );
    // Fetch and return the updated
    const {recordset} = await pool
        .request()
        .input('did', sql.Int, id)
        .query(
            'SELECT did AS id, name,location,reviews FROM Dealership WHERE did=@did',
        );

    // Return the first (and only) row from the recordset
    return [recordset[0], res.rowsAffected];
};
