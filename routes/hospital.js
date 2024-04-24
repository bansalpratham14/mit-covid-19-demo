var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
var db = require('./db');

module.exports = router;

// get hospital details
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const db_response = await db.query(
            "SELECT users.user_id,users.user_phone,users.user_name,users.user_type,users.is_verified,hospital.hos_phone,hospital.hos_type,hospital.hos_address,hospital.hos_pincode FROM users INNER JOIN hospital ON users.user_id=hospital.hos_id WHERE hospital.hos_id=$1;",
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

//update hospital details
router.put('/:id/edit', async (req, res) => {
    console.log(req.body, req.params.id)
    try {
        console.log(" iam here")
        const db_response = await db.query(
            "UPDATE hospital SET hos_type=$1, hos_address=$2, hos_pincode=$3 WHERE hos_id=$4 returning *;",
            ["hospital", req.body.hospitalAddress, req.body.hospitalPincode, req.params.id]
        )
        console.log(db_response.rows[0])
        res.status(201).json({
            status: "Edit successfull",
            data: {
                user_info: db_response.rows[0],
            }
        })
    } catch (error) {
        res.sendStatus(403);
    }
})
