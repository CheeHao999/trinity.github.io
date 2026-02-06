const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
    const url = process.env.DATABASE_URL;
    // Render and other cloud providers often require SSL
    // We append it if not present to avoid connection errors
    if (url && !url.includes('sslmode=')) {
        console.log('Enforcing SSL for database connection');
        const sslUrl = url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`;
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: sslUrl,
                },
            },
        });
    } else {
        prisma = new PrismaClient();
    }
} else {
    prisma = new PrismaClient();
}

module.exports = prisma;
