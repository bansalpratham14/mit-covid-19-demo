var express = require('express');
var router = express.Router();
var db = require('./db');

router.get('/questions', async (req, res) => {
    console.log("check")
    const data = []
    let filename = 'questions.csv'
    fs.createReadStream(filename)
    .pipe(parse({ delimiter: ',' }))
    .on('data', (r) => {
        try{
            question = r[0]
            const options = []
            for(let j=1; j<5; j++){
                if(r[j].length != 0){options.push(r[j])}
            }
            const db_response =  db.query("INSERT INTO question(quest_text, ques_options) values($1,$2);",
            [question, options]);

        }catch(err){
            console.log(err)
        }
    })
    .on('end', () => {
        console.log(data.length,"done!!");
        res.status(201).json({
            message: "Process is complete"
        })
    })
})

module.exports = router;