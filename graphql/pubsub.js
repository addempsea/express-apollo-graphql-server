import { withFilter } from 'apollo-server-express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  host: 'redis-19840.c135.eu-central-1-1.ec2.cloud.redislabs.com',
  port: '19840',
  retryStrategy: (times) => {
    // reconnect after
    return Math.min(times * 50, 2000);
  },
  password: '5FDAeYfgNVNb4ScLSmO27YBs7pvF6ROo'
};


const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

export { pubsub, withFilter };
