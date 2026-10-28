const { body } = require('express-validator');
const db = require('./db/queries');

    exports.loginValidator = [
        body('username')
            .trim()
            .notEmpty().withMessage('Username is required!'),
        body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
    ];

    exports.registerValidator = [
        body('username')
            .trim()
            .notEmpty().withMessage('Username is required')
            .isLength({
                min: 3,
                max: 15
            }).withMessage('Username must be between 3 and 15 characters')
            .custom(async value => {
                const user = await db.userGetByUsername(value);
                if (user) {
                    throw Error('Username already in use');
                };
            }),
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email must be a valid email')
            .custom(async (value) => {
                const user = await db.userGetByEmail(value);
                if (user) {
                    throw Error('Email already in use');
                };
            }),
        body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isStrongPassword({
                minLength: 8,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0
            }).withMessage('Password must have at least 8 characters, 1 upper case letter and 1 number'),
        body('confirmPassword')
            .trim()
            .notEmpty().withMessage('Confirm password field is required')
            .custom((value, { req }) => {
                return value === req.body.password;
            }).withMessage('Password does not match')
    ];

    exports.folderValidator = [
        body('name')
            .trim()
            .notEmpty().withMessage('Folder name is required')
    ];
    