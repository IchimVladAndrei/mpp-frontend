import bcrypt from 'bcrypt';
import {Router} from 'express';
import jwt from 'jsonwebtoken';
import {userByEmail, userCreate} from '../Models/user.model.js';
const userRouter = Router();
const PASSWORD_HASH_SALT_ROUNDS = 10;
userRouter.post('/login', async (req, res) => {
    const {email, pass} = req.body;
    try {
        const userRegistred = await userByEmail(email);

        if (userRegistred && (await bcrypt.compare(pass, userRegistred.pass))) {
            res.send(generateTokenResponse(userRegistred));
            return;
        }
        res.status(404).send('Email or passsword is incorrect');
    } catch (error) {
        console.log(error);
    }
});

userRouter.post('/register', async (req, res) => {
    const {name, email, pass} = req.body;

    try {
        const user = await userByEmail(email);

        if (user) {
            res.status(432).send('User already exists');
            return;
        }
    } catch (error) {
        console.log(error);
    }
    //hash password
    try {
        const hashedPass = await bcrypt.hash(pass, PASSWORD_HASH_SALT_ROUNDS);
        const newUser = await userCreate(name, email, hashedPass); //hashed pass
        if (newUser) {
            res.send(generateTokenResponse(newUser));
            return;
        }
        res.status(403).send('Error on create user');
    } catch (error) {
        console.log(error);
    }
});

userRouter.get('/admin', async (req, res) => {
    const token = req.header('Authorization');

    const isUserAdmin = await verifyAdmin(token);
    if (isUserAdmin != null) {
        res.status(200).send(isUserAdmin);
    } else res.status(401).send('Access denied');
});

async function verifyAdmin(token) {
    if (!token) {
        return null;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_TOKEN);

        if (user.isAdmin === true) {
            return user;
        }
        return null;
    } catch (error) {
        return null;
    }
}

const generateTokenResponse = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_TOKEN, //to store securely this hash
        {expiresIn: '7d'},
    );
    return {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
        token,
    };
};
export default userRouter;
