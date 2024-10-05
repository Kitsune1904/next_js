export const errorHandler = (err, req, res) => {
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    });
}