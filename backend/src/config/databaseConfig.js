import dotenv from 'dotenv';

import mysql from 'mysql';

dotenv.config();
/*import sql from 'mssql/msnodesqlv8.js';
console.log(typeof process.env.SQL_URL);
if (process.env.SQL_URL) {
    var config = {
        connectionString:
            'Driver={ODBC Driver 17 for SQL Server};Server=VLAD\\SQLEXPRESS;Database=Autovit;Trusted_Connection=yes;',
        driver: 'Autovit',
    };
}
export const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('connected to SQLServer');
        return pool;
    })
    .catch((err) => console.log('database conn failed', err));
*/
export var con = mysql.createConnection({
    host: 'eu-cluster-west-01.k8s.cleardb.net',
    user: 'bb7bf2c44a0ab9',
    password: 'c96a4849',
    database: 'heroku_acf2271dabe964f',
});
//mysql://bb7bf2c44a0ab9:c96a4849@eu-cluster-west-01.k8s.cleardb.net/heroku_acf2271dabe964f?reconnect=true
