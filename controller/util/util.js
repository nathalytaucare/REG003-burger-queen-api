module.exports = {
  validateEmail: (email) => {
    const emailRegex = /[\w._%+-]+@[\w.-]+/g;
    return emailRegex.test(email);
  },
};
