import sql from 'mssql/msnodesqlv8.js';

// const config = {
//     server: 'VLAD\\SQLEXPRESS',
//     database: 'Autovit',

//     options: {
//         trustedConnection: true,
//     },
// };

var config = {
    connectionString:
        'Driver={ODBC Driver 17 for SQL Server};Server=VLAD\\SQLEXPRESS;Database=Autovit;Trusted_Connection=yes;',
    driver: 'Autovit',
};
export const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('connected to SQLServer');
        return pool;
    })
    .catch((err) => console.log('database conn failed', err));
