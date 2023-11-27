
const isAdminMiddleware = (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};
export default isAdminMiddleware;