import {con} from '../config/databaseConfig.js';
export const userFind = async (email, pass) => {
    const res = await new Promise((resolve, reject) => {
        con.query(
            'SELECT uid AS id, email, isAdmin, name FROM Users WHERE email = ? AND pass = ?',
            [email, pass],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            },
        );
    });
    return res;
};

export const userByEmail = async (email) => {
    const res = await new Promise((resolve, reject) => {
        con.query(
            'SELECT uid AS id, email, isAdmin, name,pass FROM Users WHERE email = ?',
            [email],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const user = result[0];

                    console.log('line 28 ', user);
                    if (user) {
                        // Convert isAdmin from Buffer to Boolean
                        user.isAdmin = user.isAdmin[0] === 1;
                    }
                    resolve(user);
                    // resolve({
                    //     id: user.id,
                    //     email: user.email,
                    //     isAdmin: user.isAdmin,
                    //     name: user.name,
                    //     pass: user.pass,
                    // });
                }
            },
        );
    });
    return res;
};

export const userCreate = async (name, email, pass) => {
    await new Promise((resolve, reject) => {
        con.query(
            'INSERT INTO Users (email, name, pass) VALUES (?, ?, ?)',
            [email, name, pass],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            },
        );
    });

    const maxID = await new Promise((resolve, reject) => {
        con.query('SELECT MAX(uid) as maxId FROM Users', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].maxId);
            }
        });
    });

    const insertedUser = await new Promise((resolve, reject) => {
        con.query(
            'SELECT uid AS id, email, isAdmin, name FROM Users WHERE uid = ?',
            [maxID],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            },
        );
    });

    return insertedUser;
};
//IS THE BIT THE SAME IN MYSQL?
