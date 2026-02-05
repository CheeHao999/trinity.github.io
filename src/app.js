const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const maintenanceMiddleware = require('./login/maintenanceMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

const authRoutes = require('./login/authRoutes');
const adminRoutes = require('./login/adminRoutes');
const { lostItemRouter, foundItemRouter } = require('./dashboard/itemRoutes');
const notificationRoutes = require('./dashboard/notificationRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(maintenanceMiddleware);
app.use('/uploads', express.static('uploads'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lost-items', lostItemRouter);
app.use('/api/found-items', foundItemRouter);
app.use('/api/notifications', notificationRoutes);

const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;