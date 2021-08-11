module.exports = {
// USERS
  // GET
  getUsers: (req, resp, next) => {
    resp.send(200, { users: [] });
    next();
  },
};
