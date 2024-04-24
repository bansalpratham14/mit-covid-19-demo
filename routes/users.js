var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
var db = require('./db');

// All user registration
router.post('/register', async (req, res) => {
  try {
    console.log(req.body)

    const user_db = await db.query(
      "insert into users(user_phone, user_name, user_pass, user_type, is_verified) values($1, $2, $3, $4, $5) returning *",
      [req.body.phone, req.body.nameInput, req.body.password, req.body.userType, req.body.verified]
    )

    let db_response = null
    if (req.body.userType === "patient") {
      db_response = await db.query(
        "insert into patient(patient_id, patient_phone) values($1, $2) returning *;",
        [user_db.rows[0].user_id, req.body.phone]
      )
    } else if (req.body.userType === "pharmacy") {
      db_response = await db.query(
        "insert into pharmacy(pharma_id, pharma_phone) values($1, $2) returning *;",
        [user_db.rows[0].user_id, req.body.phone]
      )
    } else if (req.body.userType === "doctor") {
       db_response = await db.query(
        "insert into doctor(doc_id, doc_phone, doc_hos_id) values($1, $2, $3) returning *;",
        [user_db.rows[0].user_id, req.body.phone, Number(req.body.hospitalId)]
      )
    } else if (req.body.userType === "hospital") {
      db_response = await db.query(
        "insert into hospital(hos_id, hos_phone) values($1, $2) returning *;",
        [user_db.rows[0].user_id, req.body.phone]
      )
    }
    console.log(db_response.rows[0])

    jwt.sign(db_response.rows[0], process.env.SECRETKEY, (err, token) => {
      if (err) {
        res.sendStatus(403)
      } else {
        res.status(201).json({
          status: "Registration successful",
          data: {
            user_id: user_db.rows[0].user_id,
            user_type: req.body.userType,
            token: token //json web token
          }
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(403)
  }
})

// GET one user completly private details
router.get('/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const db_response = await db.query(
      "SELECT user_phone, user_name, user_type, is_verified FROM users WHERE user_id=$1",
      [req.params.id]
    )
    console.log(db_response.rows[0])
    jwt.sign(db_response.rows[0], process.env.SECRETKEY, (err, token) => {
      if (err) {
        res.sendStatus(403)
      } else {
        res.status(201).json({
          status: "success",
          data: {
            user_info: db_response.rows[0],
            token: token //json web token
          }
        })
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const db_response = await db.query("select * from users where user_phone = $1;", [req.body.phoneNumber]);
    console.log(db_response.rows[0])

    // If user input is correct, successfully loged in
    if (db_response.rows[0].user_pass === req.body.password) {
      jwt.sign(db_response.rows[0], process.env.SECRETKEY, (err, token) => {
        if (err) {
          res.sendStatus(403)
        } else {
          res.status(201).json({
            status: "Login sucessfull",
            data: {
              user_info: db_response.rows[0],
              token: token //json web token
            }
          })
        }
      })
      // logged in failed
    } else {
      res.status(201).json({
        status: "Login failed",
        data: {
          response: "Wrong Details",
        }
      })
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(403)
  }
})

module.exports = router;
