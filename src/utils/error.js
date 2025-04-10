const globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong',
        data: err.data || {}
    });
};

class Exception extends Error {
    constructor(message, statusCode = 404, status = 'error', data = {}) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.status = status;
        this.data = data;
    }
}

class BadRequestException extends Exception {
    constructor(message, data) {
        super(message, 400, 'BadRequest', data);
    }
}

class UnauthorizedException extends Exception {
    constructor(message, data) {
        super(message, 401, 'Unauthorized', data);
    }
}

class ForbiddenException extends Exception {
    constructor(message, data) {
        super(message, 403, 'Forbidden', data);
    }
}

class NotFoundException extends Exception {
    constructor(message, data) {
        super(message, 404, 'NotFound', data);
    }
}

class ValidationError extends Exception {
    constructor(message, data) {
        super(message, 422, 'Validation Error', data);
    }
}

class InternalServerErrorException extends Exception {
    constructor(message, data) {
        super(message, 500, 'InternalServerError', data);
    }
}

module.exports = {
    globalErrorHandler,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    InternalServerErrorException,
    Exception,
    ValidationError
};