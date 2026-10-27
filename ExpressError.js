class ExpressError {
    constructor (status=500, message='Something went wrong!') {
        this.status = status;
        this.message = message;
    };
};

module.exports = ExpressError;