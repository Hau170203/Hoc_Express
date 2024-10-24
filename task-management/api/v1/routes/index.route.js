const taskRoute = require('./task.route');
const userRoute =require('./user.route');
const authMiddleware = require('../../../middleware/auth.middleware');

module.exports = (app) => {
    const ver = '/api/v1/'
    app.use(ver +'task',authMiddleware.requireAuth, taskRoute);
    app.use(ver +'user', userRoute);
}