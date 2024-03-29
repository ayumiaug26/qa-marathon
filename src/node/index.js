const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3510;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_ayumi_tanaka", // PostgreSQLのユーザー名に置き換えてください
  host: "localhost",
  database: "db_ayumi_tanaka", // PostgreSQLのデータベース名に置き換えてください
  password: "pass", // PostgreSQLのパスワードに置き換えてください
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

app.post("/customer/delete", async (req, res) => {
  try {
    const id = req.body.id;
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
})

app.post("/customer/update", async (req, res) => {
  try {
    const { id, companyName, industry, contact, location } = req.body;
    const customer = await pool.query(
      "UPDATE customers SET company_name = $2, industry = $3, contact = $4, location = $5 WHERE customer_id = $1 RETURNING *",
      [id, companyName, industry, contact, location]
    );
    res.json({ success: true, customer: customer.rows[0] });
  } catch (err) {
    console.error(err);
    res.send(err);
  }
})

app.use(express.static("public"));
