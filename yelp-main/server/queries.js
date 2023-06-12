const db = require("./db");

async function getAllRestaurants() {
  try {
    const statment = `
    SELECT
    restaurants.id,
    restaurants.name,
    restaurants.location,
    restaurants.price_range,
    TRUNCATE(AVG(reviews.rating), 0) AS avg_rating,
    COUNT(reviews.id) AS review_count
FROM
    restaurants
    LEFT JOIN reviews ON restaurants.id = reviews.restaurant_id
GROUP BY
    restaurants.id;`;
    const results = await db.query(statment);
    // console.log(results);
    return results;
  } catch (err) {
    console.log(err);
  }
}

async function getAllReviews(restaurantID) {
  try {
    const sql = "select * from reviews where restaurant_id = ?;";
    const sqlParams = [restaurantID];
    // console.log(restaurantID);
    const results = await db.query(sql, sqlParams);
    // console.log(results);
    return results;
  } catch (err) {
    console.log(err);
  }
}

async function createOneReview(restaurantID, name, rating, review) {
  try {
    const insertResult = await db.query(
      "insert into reviews (name, rating, review, restaurant_id) values (?);"
    [[name, rating, review, restaurantID]]);
    console.log("===========================")
    console.log({ insertId: insertResult.insertId, insertResult});
    const result = await db.query (
      "select * from reviews where restaurant_id = ?",
      [[insertResult.insertId]]
    )
    // const results = await db.query(insertResult, result);
    // console.log({results});
    return result[0];
  } catch (err) {
    console.log(err);
  }
}


// app.post("/api/restaurants", async (req, res) => {
//   // console.log(req.body);
//   try {
//     const insertResult = await db.query(
//       "insert into restaurants (name, location, price_range) values (?)",
//       [[req.body.name, req.body.location, req.body.price_range]]
//     );
//     const result = await db.query(
//       "select * from restaurants where id = ?",
//       [[insertResult.insertId]])
//     console.log({insertResult: insertResult, result: result, body:req.body});
//     res.json(result[0]);
//   } catch (err) {
//     console.log(err);


module.exports.getAllRestaurants = getAllRestaurants;
module.exports.getAllReviews = getAllReviews;
module.exports.createOneReview = createOneReview;
