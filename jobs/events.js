import { sendPassword } from './worker/email';

export default (queue) => {
  queue.process('SEND_PASSWORD_TO_EMAIL', sendPassword);
};
