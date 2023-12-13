const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3510;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3510", // PostgreSQLのユーザー名に置き換えてください
  host: "postgres",
  database: "crm_3510", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_3510", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  // console.log(req.body)
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.get("/customer/:id", async (req, res) => {
  try {
    const id = req.query.id;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
    res.send(customerData.rows);
    console.log(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
})

app.use(express.static("public"));
