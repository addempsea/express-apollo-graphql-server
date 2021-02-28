import Queue from 'bull';
import jobEvents from './events';
import { errorLogger } from '../utils/helpers';

export const queue = new Queue('Jobs');

queue.setMaxListeners(queue.getMaxListeners() + 100);

jobEvents(queue);
export const createJob = (options) => {
  const opts = { priority: 0, attempts: 5, ...options };
  queue.add(opts.type, opts.data, {
    attempts: opts.attempts,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: true
  });
};

// Queue Events

// Fires when a job is added to queue
queue.on('active', ({ id, name }) => {
  logger.info(`The job ${id} of name: ${name} got added to queue`);
});
queue.on('removed', ({ id, name }) => {
  logger.info(`The job ${id} of name: ${name} has been removed from the queue`);
});
// Fires when a job is done with.
queue.on('completed', ({ id }) => {
  logger.info(`Job with the id: ${id} just completed`);
  queue.getJob(id).then((job) => console.log(job));
});

// Fires when a job fails after a certain retry.
queue.on('failed', ({ id, attemptsMade }, err) => {
  if (logger) {
    logger.info(
      `Job of id: ${id} failed with the message: ${err.message} after ${attemptsMade} attempts`
    );
  }
});

//clean all jobs that failed over 10 seconds ago.
queue.clean(10000, 'failed');
queue.on('cleaned', (jobs, type) => {
  console.log('Cleaned %s %s jobs', jobs.length, type);
});
// Fires whenever a job fails.
queue.on('failed', ({ id }, err) => {
  if (logger)
    logger.info(`Job of id: ${id} has failed with the message: ${err.message}`);
});
