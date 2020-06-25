const usersHelper = (pool) => {
  /** Get a single user from the database given their email. **/
  const getUserWithEmail = function (email) {
    const queryStr = `SELECT * FROM users WHERE email=$1`;
    const value = [email.toLowerCase()];

    return pool
      .query(queryStr, value)
      .then((dbRes) => (dbRes.rowCount === 1 ? dbRes.rows[0] : null));
  };

  /** Get a single user from the database given their id. **/
  const getUserWithId = function (id) {
    const queryStr = `SELECT * FROM users WHERE id=$1`;
    return pool
      .query(queryStr, [id])
      .then((dbRes) => (dbRes.rowCount === 1 ? dbRes.rows[0] : null));
  };

  /** Add a new user to the database. **/
  const addUser = function (user) {
    const queryStr = `INSERT INTO users (name, email, password) VALUES ($1,$2, $3) RETURNING *`;
    const values = [user.name, user.email, user.password];

    return pool.query(queryStr, values).then((dbRes) => dbRes);
  };

  return { getUserWithEmail, getUserWithId, addUser };
};

module.exports = usersHelper;
