const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');
require('dotenv').config();

const pool = new Pool({
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryStr = `SELECT * FROM users WHERE email=$1`;
  const value = [email.toLowerCase()];

  return pool
    .query(queryStr, value)
    .then((dbRes) => (dbRes.rowCount === 1 ? dbRes.rows[0] : null));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryStr = `SELECT * FROM users WHERE id=$1`;
  return pool
    .query(queryStr, [id])
    .then((dbRes) => (dbRes.rowCount === 1 ? dbRes.rows[0] : null));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryStr = `INSERT INTO users (name, email, password) VALUES ($1,$2, $3) RETURNING *`;
  const values = [user.name, user.email, user.password];

  return pool.query(queryStr, values).then((dbRes) => dbRes);
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryStr = `SELECT * FROM properties LIMIT $1`;
  return pool.query(queryStr, [limit]).then((dbRes) => dbRes.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
