import {con} from '../config/databaseConfig.js';
export const read = async () => {
    return new Promise((resolve, reject) => {
        con.query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars',
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            },
        );
    });
};
export const readById = async (id) => {
    return new Promise((resolve, reject) => {
        con.query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE cid = ?',
            [id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const rowsAffected = result.length > 0 ? 1 : 0;
                    resolve([result[0], rowsAffected]);
                }
            },
        );
    });
};
export const carByDID = async (did) => {
    return new Promise((resolve, reject) => {
        con.query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE did = ?',
            [did],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const rowsAffected = result.length > 0 ? 1 : 0;
                    resolve([result[0], rowsAffected]);
                }
            },
        );
    });
};

export const create = async (brand, price, yearBought, dealer) => {
    const didRes = await new Promise((resolve, reject) => {
        con.query(
            'SELECT did FROM Dealership WHERE name = ?',
            [dealer],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].did);
                }
            },
        );
    });

    await new Promise((resolve, reject) => {
        con.query(
            'INSERT INTO Cars (brand, price, yearBought, did) VALUES (?, ?, ?, ?)',
            [brand, price, yearBought, didRes],
            (err, result) => {
                if (err) {
                    if (err.errno === 1062) {
                        // Duplicate entry error
                        console.log(
                            'Duplicate record error occurred. Continuing execution.',
                        );
                        resolve();
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(result); //result?
                }
            },
        );
    });

    const maxIdRes = await new Promise((resolve, reject) => {
        con.query('SELECT MAX(cid) AS maxId FROM Cars', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].maxId);
            }
        });
    });

    const insertedCarQuery = await new Promise((resolve, reject) => {
        con.query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE cid = ?',
            [maxIdRes],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            },
        );
    });

    return insertedCarQuery;
};

export const deleter = async (id) => {
    return new Promise((resolve, reject) => {
        con.query('DELETE FROM Cars WHERE cid = ?', [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows);
            }
        });
    });
};

export const updater = async (id, brand, price, yearBought) => {
    await new Promise((resolve, reject) => {
        con.query(
            'UPDATE Cars SET brand = ?, price = ?, yearBought = ? WHERE cid = ?',
            [brand, price, yearBought, id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            },
        );
    });

    const recordset = await new Promise((resolve, reject) => {
        con.query(
            'SELECT cid AS id, brand, price, yearBought FROM Cars WHERE cid = ?',
            [id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            },
        );
    });

    return [recordset, 1];
};

// export function generateMoreCars() {
//     for (let i = 0; i < 1000; i++) {
//         try {
//             create(
//                 faker.vehicle.manufacturer(),
//                 faker.helpers.rangeToNumber({min: 1, max: 300}),
//                 faker.helpers.rangeToNumber({min: 1950, max: 2024}),
//                 //faker.helpers.rangeToNumber({min: 40, max: 10000}),
//             );
//         } catch (error) {
//             console.log('duplicat');
//         }
//     }
// }
