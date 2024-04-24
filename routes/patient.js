var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
var db = require('./db');

// get patient details
router.get('/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const db_response_1 = await db.query(
      "SELECT users.user_id,users.user_phone,users.user_name,users.user_type,users.is_verified,patient.patient_age,patient.patient_weight,patient.patient_heart_rate,patient.patient_temperature,patient.patient_location,patient.patient_pincode FROM users INNER JOIN patient ON users.user_id=patient.patient_id WHERE patient.patient_id=$1;",
      [req.params.id]
    )
    const db_response_2 = await db.query(
      "SELECT * FROM orders WHERE user_id = $1;",
      [req.params.id]
    )
    res.status(201).json({
      status: "Success",
      data: {
        user_info: db_response_1.rows[0],
        orders_list: db_response_2.rows
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
})

//Edit patient details
router.put('/:id/edit', async (req, res) => {
  console.log(req.body)
  try {
    const db_response = await db.query(
      "UPDATE patient SET patient_age=$1, patient_weight=$2, patient_heart_rate=$3, patient_temperature=$4, patient_location=$5, patient_pincode=$6, dob=$7 WHERE patient_id=$8 returning *;",
      [req.body.patientAge, req.body.patientWeight, req.body.patientHeartRate, req.body.patientTemperature, req.body.patientLocation, req.body.patientPincode, req.body.patientDob, req.params.id]
    )
    console.log(db_response.rows[0])
    res.status(201).json({
      status: "Edit successfull",
      data: {
        user_info: db_response.rows[0],
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
})

// Get all orders
router.get('/:id/orders', async (req, res) => {
  console.log(req.params.id)
  try {
    const db_response = await db.query(
      "SELECT * FROM orders where user_id = $1;",
      [req.params.id]
    )
    res.status(201).json({
      status: "Success",
      data: {
        orders: db_response.rows,
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
});

// Get One orders
router.get('/:id/order', async (req, res) => {
  console.log(req.params.id)
  try {
    const db_response = await db.query(
      "SELECT * FROM orders where order_id = $1;",
      [req.params.id]
    )
    res.status(201).json({
      status: "Success",
      data: {
        order: db_response.rows[0],
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
});

// Get first question
router.get('/:id/question/first', async (req, res) => {
  try {
    const db_response = await db.query("SELECT * FROM question WHERE ques_id=5;") // we are fetching first question
    const db_report = await db.query("INSERT INTO reports(patient_id) VALUES($1) returning *;", [req.params.id])
    // console.log("Question:", db_response.rows[0].quest_text)
    // console.log("Option 1:",db_response.rows[0].ques_options[0])
    // console.log("Option 2:",db_response.rows[0].ques_options[1])
    // console.log("Option 3:",db_response.rows[0].ques_options[2])
    // console.log("Option 4:",db_response.rows[0].ques_options[3])
    res.status(201).json({
      status: "Success",
      data: {
        question: db_response.rows[0],
        reportId: db_report.rows[0].id
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
});

// Get next question

// if isEnding variable is true,
// then call /report/:id api 
// else call for next question using same api 

router.post('/question/next', async (req, res) => {

  console.log(req.body.reportId, req.body.oldQuestionId, req.body.answer, req.body.wasLastQuestion)

  // try {
    var isEnding = false;
    var db_response;
    if (!req.body.wasLastQuestion) {
      try {
        db_response = await db.query("SELECT * FROM question WHERE ques_id=$1;", [Number(req.body.oldQuestionId) + 1])
        console.log(db_response.rows);
        if (db_response.rows[0].ques_id > 10) {
          isEnding = true
          console.log('isEnding', isEnding, 'ques_id', db_response.rows[0].ques_id);
        }
      } catch (error) {
        db_response = await db.query("SELECT * FROM question WHERE ques_id=$1;", [Number(req.body.oldQuestionId) + 2])
        console.log(db_response.rows);
        if (db_response.rows[0].ques_id > 10) {
          isEnding = true
          console.log('isEnding', isEnding, 'ques_id', db_response.rows[0].ques_id);
        }
      }
      
    } else {
      isEnding = true;
    }
    const db_report = await db.query("UPDATE reports SET ques_id = array_append(ques_id, $1), ans = array_append(ans, $2) WHERE id = $3;",
      [(req.body.oldQuestionId).toString(), (req.body.answer).toString(), req.body.reportId]
    )

    res.status(201).json({
      status: "Success",
      data: {
        question: req.body.wasLastQuestion ? [{
          quest_text: "That was the last question"
        }] : db_response.rows[0],
        reportId: req.body.reportId,
        isEnding: isEnding,
      }
    })
  // } catch (error) {
  //   res.sendStatus(403)
  // }
});

// show checkup report
router.get('/report/:id', async (req, res) => {
  try {
    const db_response = await db.query(
      "SELECT * FROM reports WHERE id = $1;",
      [req.params.id]
    )
    res.status(201).json({
      status: "Success",
      data: {
        report: db_response.rows[0],
      }
    })
  } catch (error) {
    res.sendStatus(403)
  }
});

 // Book appointment 
 router.post('/appointments', async (req, res) => {
  try {
    const db_response = await db.query(
      "INSERT INTO appointments(appoint_date, appoint_time, purpose, price) VALUES($1, $2, $3, $4) RETURNING *;",
      [req.body.date, req.body.time, req.body.purpose, req.body.price]
    )
    res.status(201).json({
      status: "Appointment booked",
      data: {
        appointments: db_response.rows
      }
    })
  } catch(error) {
    console.log(error)
  }
});

module.exports = router;
