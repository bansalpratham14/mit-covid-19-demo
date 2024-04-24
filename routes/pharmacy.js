var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
var db = require('./db');

// get patient deatils
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    try{
        const db_response = await db.query(
            "SELECT users.user_id,users.user_name, users.user_phone, users.user_type, users.is_verified, pharmacy.pharma_type, pharmacy.pharma_address, pharmacy.pharma_pincode, pharmacy.balance, pharmacy.orders FROM users INNER JOIN pharmacy ON users.user_id=pharmacy.pharma_id WHERE pharmacy.pharma_id=$1;",
            [req.params.id]
        )
        console.log(db_response.rows[0])
        res.status(201).json({
            status: "Success",
            data: {
                user_info: db_response.rows[0]
            }
        })
    } catch (error) {
        res.sendStatus(403)
    }
})

//Edit patient details
router.put('/:id/edit',async (req, res) => {
    console.log(req.body, req.params.id)
    try {
        
        const db_response = await db.query(
            "UPDATE pharmacy SET pharma_type=$1, pharma_address=$2, pharma_pincode=$3, balance=$4, orders=$5 WHERE pharma_id=$6 returning *;",
            [req.body.pharmacyType, req.body.pharmacyAddress, req.body.pharmacyPincode, req.body.pharmacyBalance, req.body.pharmacyOrders, req.params.id]
        )
        console.log("I am here")
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

// fetch one order
router.get("order/:id", async (req, res) => {
    try {

        console.log("This is order id: ",req.params.id)
        const response_db = db.query("SELECT * FROM orders WHERE order_id = $1",
        [req.params.id]);
        console.log(response_db.row[0])

        res.status(201).json({
            status: "success",
            data:{
                db_data: db_response.rows[0],
            }
        })

    } catch (error) {
        res.sendStatus(403)
        console.log(error)
    }
})

// fetch all order
router.get("orders/:id", async (req, res) => {
    try {

        console.log("this is pharma id: ",req.params.id)
        const response_db = db.query("SELECT * FROM ORDERS WHERE pharma_id = $1",
        [req.params.id]);
        console.log(response_db.rows)
        res.status(201).json({
            status: "success",
            data:{
                db_data: db_response.rows,
            }
        })
    } catch (error) {
        res.sendStatus(403)
        console.log(error)
    }
})


module.exports = router;
