var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
var db = require('./db');
const { response } = require('express');

// get doctor deatils
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const db_response = await db.query(
            "SELECT users.user_id,users.user_phone,users.user_name,users.user_type,users.is_verified,doctor.doc_expi,doctor.doc_dep,doctor.doc_aos,doctor.doc_qual,doctor.doc_address,doctor.doc_pincode FROM users INNER JOIN doctor ON users.user_id=doctor.doc_id WHERE doctor.doc_id=$1;",
            [req.params.id]
        )
        console.log(db_response.rows[0])
        res.status(201).json({
            status: "Success",
            data: {
                user_info: db_response.rows[0],
            }
        })
    } catch (error) {
        res.sendStatus(403)
    }
})

router.put('/:id/edit', async (req, res) => {
    console.log(req.body, req.params.id)
    try {
        console.log(" iam here")
        const db_response = await db.query(
            "UPDATE doctor SET doc_expi=$1, doc_dep=$2, doc_aos=$3, doc_qual=$4, doc_address=$5, doc_pincode=$6 WHERE doc_id=$7 returning *;",
            [req.body.doctorExpi, req.body.doctorDep, req.body.doctorAos, req.body.doctorQual, req.body.doctorAddress, req.body.doctorPincode, req.params.id]
        )
        // error: doc_hos_id id do not exist because hospital in not registered yet
        console.log(db_response.rows[0])
        res.status(201).json({
            status: "Edit successfull",
            data: {
                user_info: db_response.rows[0],
            }
        })
    } catch (error) {
        console.log("error")
        res.sendStatus(403)
    }
})

// Count Doctor Table Rows
router.get('/selectdoctor/count', async (req, res) => {
    console.log(req.body.initialRows, req.body.remainingRows);
    try {
        const db_response = await db.query("select count(*) from doctor;")
        res.status(201).json({
            status: "Success",
            data: {
                rows: db_response.rows[0].count,
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(403)
    }
});

// Get Doctors
router.post('/selectdoctor', async (req, res) => {
    console.log(req.body.initialRows, req.body.remainingRows);
    try {
        const initialRows = Number(req.body.initialRows);
        const remainingRows = Number(req.body.remainingRows);
        const limit = remainingRows < 6 ? remainingRows : 6;
        const db_response = await db.query("SELECT users.user_id,users.user_name,users.is_verified,doctor.doc_expi,doctor.doc_dep,doctor.doc_aos,doctor.doc_qual,doctor.doc_address, doctor.doc_hos_id FROM users INNER JOIN doctor ON users.user_id=doctor.doc_id ORDER BY doc_id ASC LIMIT $1 OFFSET $2;", [limit, initialRows - remainingRows])
        res.status(201).json({
            status: "Success",
            data: {
                doctors: db_response.rows,
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(403)
    }
});

// Get all appointments
router.get('/:id/appointments', async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM appointments WHERE doctors_id=$1;',[req.params.id])
        res.status(201).json({
            status: 'success',
            data: response.rows
        })
    } catch (error) {
        console.log(error);
    } 
});

// Get all checkup
router.get('/:id/checkups', async (req, res) => {

});
module.exports = router;
