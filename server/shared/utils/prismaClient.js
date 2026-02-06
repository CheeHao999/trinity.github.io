const { PrismaClient } = require('@prisma/client');

let prisma;

const url = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
    // Render and other cloud providers often require SSL
    if (url && !url.includes('sslmode=')) {
        console.log('Production mode: Enforcing SSL for database connection');
        const sslUrl = url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`;
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: sslUrl,
                },
            },
        });
    } else {
        console.log('Production mode: Using standard connection string');
        prisma = new PrismaClient();
    }
} else {
    console.log('Development mode: Initializing Prisma');
    prisma = new PrismaClient();
}

// Add connection error logging
prisma.$connect()
    .then(() => console.log('Prisma successfully connected to database'))
    .catch((err) => {
        console.error('Prisma connection error during initialization:', err);
    });

module.exports = prisma;
