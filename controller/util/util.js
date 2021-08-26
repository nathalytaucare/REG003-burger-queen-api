module.exports = {
  validateEmail: (uid) => {
    const emailRegex = /[\w._%+-]+@[\w.-]+/g;
    return emailRegex.test(uid);
  },
};
