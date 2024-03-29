const { Pool } = require('pg');
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
  const queryStr = `
  SELECT properties.*, reservations.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
      JOIN reservations ON reservations.property_id = properties.id
      JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1 AND
      now()::date > end_date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  return pool.query(queryStr, [guest_id, limit]).then((dbRes) => {
    console.log(dbRes.rows);
    return dbRes.rows;
  });
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
  const queryVal = [];
  let queryStr = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id`;

  // Check if options obj contains city
  if (options.city) {
    queryVal.push(`%${options.city}%`);
    queryStr += `WHERE city LIKE $${queryVal.length} `;
  }

  // Check if option obj contains owner_id
  if (options.owner_id) {
    queryVal.push(options.owner_id);
    if (queryStr.includes('WHERE')) {
      queryStr += `AND properties.owner_id=$${queryVal.length}`;
    } else {
      queryStr += `
  WHERE properties.owner_id=$${queryVal.length}`;
    }
  }

  // Check if option obj contains minimum_price_night and maximum_price_night
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryVal.push(
      options.minimum_price_per_night,
      options.maximum_price_per_night
    );
    if (queryStr.includes('WHERE')) {
      queryStr += `AND properties.cost_per_night BETWEEN $${
        queryVal.length - 1
      } AND $${queryVal.length}`;
    } else {
      queryStr += `
      WHERE properties.cost_per_night BETWEEN $${queryVal.length - 1} AND $${
        queryVal.length
      }`;
    }
  }

  // add the GROUP BY clause
  queryStr += `
  GROUP BY properties.id`;

  // Check if options obj contains minimum rating
  if (options.minimum_rating) {
    queryVal.push(options.minimum_rating);
    queryStr += `
  HAVING avg(property_reviews.rating) >= $${queryVal.length}`;
  }

  // Push limit
  queryVal.push(limit);
  queryStr += `
  ORDER BY cost_per_night
  LIMIT $${queryVal.length};
  `;

  console.log(queryStr);
  console.log(queryVal);

  return pool.query(queryStr, queryVal).then((dbRes) => dbRes.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryVal = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code,
  ];
  const queryStr = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url,cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;

  return pool.query(queryStr, queryVal).then((dbRes) => {
    console.log(dbRes.rows);
    return dbRes.rows[0];
  });
};
exports.addProperty = addProperty;
