export const sendPassword = ({ data }, done) => {
  try {
    console.log(data[0]);
    done();
  } catch (error) {
    done(error);
  }
};
