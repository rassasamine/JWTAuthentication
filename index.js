const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const key = 'secretKeyHere';

//  FORMAT OF TOKEN
//  AUTHORIZATION : Bearer <access_token>

//  verify token Middleware
const verifyToken = (req, res, next) => {
    //  Get Auth header Value
    const bearerHeader = req.headers['authorization'];
    //  Check if bearer is undefined
    if (typeof bearerHeader != 'undefined') {
        //  Split at the space
        const bearer = bearerHeader.split(' ');
        //  Get token from array
        const bearerToken = bearer[1];
        //  Set the token
        req.token = bearerToken;
        //  Call the next middleware
        next();
    } else {
        //  Forbidden
        res.sendStatus(403);
    }
}

app.get('/api', (req, res) => {
    res.json({
        message: "welcome to the api"
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, key, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "Post created...",
                Data: authData
            });
        }
    })
});

app.post('/api/login', (req, res) => {
    //  Mock user
    const user = {
        id: 1,
        username: 'hedi',
        email: 'hedi@gmail.com'
    };

    jwt.sign({user: user}, key, {expiresIn : '30s'}, (err, token) => {
        res.json({
            token: token,
            user: user
        })
    })
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});