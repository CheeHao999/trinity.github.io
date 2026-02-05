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
  // In development, redirect directly to the frontend dev server
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return res.redirect('http://localhost:5173');
  }

  const indexPath = path.join(__dirname, '../index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: "Trinity API is running",
      status: "online",
      frontend: "https://cheehao999.github.io/trinity.github.io/"
    });
  }
});

const PORT = process.env.PORT || 3000;

const seedAdmin = async () => {
  try {
    const prisma = require('./shared/utils/prismaClient');
    const bcrypt = require('bcryptjs');
    const email = 'admin1@gmail.com';
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Upsert admin user to ensure they exist with known credentials
    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email,
        name: 'Trinity Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Admin user verified/reset successfully');
  } catch (e) {
    console.error('Failed to seed admin:', e);
  }
};

app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;