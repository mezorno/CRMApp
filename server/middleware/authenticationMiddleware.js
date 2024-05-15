const jwt = require('jsonwebtoken');

const authentcationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 
                   'LONG-ASS-KEY-WE-SHOULD-CHANGE-AT-SOME-POINT-TO-BE-LESS-GUESSABLE', 
        (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authentcationMiddleware;