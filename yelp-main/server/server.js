require("dotenv").config();

const express = require("express");
// const morgan = require("morgan");

const app = express();
const cors = require("cors");

const db = require("./db");

const queries = require("./queries");

// translates body to json objects
app.use(express.json());
app.use(cors());

// GET all restaurants
app.get("/api/restaurants", async (req, res) => {
  const restaurants = await queries.getAllRestaurants();
  res.status(200).json({
    status: "success",
    results: restaurants.length,
    data: {
      restaurant: restaurants,
    },
  });
});

// GET a restaurant
app.get("/api/restaurants/:id", async (req, res) => {
  console.log(req.params.id);
  let result = null;
  try {
    const sql = "select * from restaurants where id = ?";
    const sqlParams = [req.params.id];

    console.log(sql);
    result = await db.query(sql, sqlParams);
  } catch (err) {
    console.log(err);
    console.log("error!!!!!");
  }
  console.log(result[0]);

  res.json(result[0]);
});

// get all reviews for restaurant
app.get("/api/restaurants/:id/reviews", async (req, res) => {
  const reataurantID = req.params.id;
  const reviews = await queries.getAllReviews(reataurantID);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});

// creat a review
app.post("/api/restaurants/:id/reviews", async (req, res) => {
  // console.log(req.body);
  const restaurantID = req.params.id
  const review = await queries.createOneReview(restaurantID, req.body.name, req.body.rating, req.body.review)
  res.status(200).json(review);
});


// Create (POST) a restaurant
app.post("/api/restaurants", async (req, res) => {
  // console.log(req.body);
  try {
    const insertResult = await db.query(
      "insert into restaurants (name, location, price_range) values (?)",
      [[req.body.name, req.body.location, req.body.price_range]]
    );
    const result = await db.query(
      "select * from restaurants where id = ?",
      [[insertResult.insertId]])
    console.log({insertResult: insertResult, result: result, body:req.body});
    res.json(result[0]);
  } catch (err) {
    console.log(err);
  //   const result = await db.query(
  //     "insert into restaurants (name, location, price_range) values (?)",
  //     [[req.body.name, req.body.location, req.body.price_range]],
  //     function (err, result) {
  //       if (err) throw err;
  //       console.log("Number of records inserted: " + result.affectedRows);
  //     }
  //   );
  //   console.log({result: result, body:req.body});
  //   res.json(result);
  // } catch (err) {
  //   console.log(err);
  }
});

// Update restaurants
app.put("/api/restaurants/:id", async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  try {
    const result = await db.query(
      "update restaurants set name = ?, location = ?, price_range = ? where id = ?",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

// DELETE restaurants
app.delete("/api/restaurants/:id", async (req, res) => {
  try {
    const result = await db.query("delete from restaurants where id = ?", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

const port = 3005;



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
