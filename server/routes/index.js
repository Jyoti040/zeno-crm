const authRoutes = require('./auth');
const customerRoutes = require('./customer');
const campaignRoutes = require('./campaigns');

module.exports = app => {
  app.use('/auth', authRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/campaigns', campaignRoutes);
};
