import {con} from '../config/databaseConfig.js';
export const read = async () => {
    return new Promise((resolve, reject) => {
        con.query(
            'SELECT did AS id, name, location, reviews FROM Dealership',
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

export const paginateDealers = async (did, page) => {
    const pageSize = 1;
    const offset = (page - 1) * pageSize;
    const myQuery = `
        SELECT cid AS id, brand, price, yearBought
        FROM Cars
        WHERE did = ?
        ORDER BY cid
        LIMIT ?, ?
    `;

    return new Promise((resolve, reject) => {
        con.query(myQuery, [did, offset, pageSize], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export const readById = async (id) => {
    return new Promise((resolve, reject) => {
        con.query(
            'SELECT did AS id, name, location, reviews FROM Dealership WHERE did = ?',
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

export const deleter = async (id) => {
    return new Promise((resolve, reject) => {
        con.query(
            'DELETE FROM Dealership WHERE did = ?',
            [id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            },
        );
    });
};

export const create = async (name, location, reviews) => {
    try {
        console.log(reviews);
        await new Promise((resolve, reject) => {
            con.query(
                'INSERT INTO Dealership (name, location, reviews) VALUES (?, ?, ?)',
                [name, location, reviews],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(); //result?>
                    }
                },
            );
        });

        const maxIdRes = await new Promise((resolve, reject) => {
            con.query(
                'SELECT MAX(did) AS maxId FROM Dealership',
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].maxId);
                    }
                },
            );
        });

        const insertedDealerQuery = await new Promise((resolve, reject) => {
            con.query(
                'SELECT did AS id, name, location, reviews FROM Dealership WHERE did = ?',
                [maxIdRes],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: result[0].id,
                            name: result[0].name,
                            location: result[0].location,
                            reviews: result[0].reviews,
                        });
                    }
                },
            );
        });
        return insertedDealerQuery;
    } catch (err) {
        console.log(err);
    }
};

export const updater = async (id, name, location, reviews) => {
    await new Promise((resolve, reject) => {
        con.query(
            'UPDATE Dealership SET name = ?, location = ?, reviews = ? WHERE did = ?',
            [name, location, reviews, id],
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
            'SELECT did AS id, name, location, reviews FROM Dealership WHERE did = ?',
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
//DEALERS PAGINATING MAY NOT BE OK?

// export const generateThousandDealers = () => {
//     for (let i = 0; i < 0; i++) {
//         create(
//             faker.company.name(),
//             faker.location.city(),
//             faker.helpers.rangeToNumber({min: 10, max: 49}) / 10,
//         );
//     }
// };
