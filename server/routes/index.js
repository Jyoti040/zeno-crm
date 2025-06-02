const authRoutes = require('./auth');
const customerRoutes = require('./customer');
const campaignRoutes = require('./campaign');
const orderRoutes = require('./order');
const { isAuthenticated } = require('../middlewares/Auth');

module.exports = app => {
  app.use('/auth', authRoutes);
  app.use('/api/customers',isAuthenticated, customerRoutes);
  app.use('/api/campaigns',isAuthenticated, campaignRoutes);
  app.use('/api/orders',isAuthenticated, orderRoutes);
};
