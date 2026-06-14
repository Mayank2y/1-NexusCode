const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-10532.c57.us-east-1-4.ec2.cloud.redislabs.com',
        port: 10532
    }
});

module.exports = redisClient;