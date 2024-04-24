var jwt = require('jsonwebtoken')
var express = require('express');
var router = express.Router();
var db = require('./db');
// const parse = require('csv-parse')
// const fs = require('fs')
var bodyParser = require('body-parser')
var UssdMenu = require('ussd-menu-builder');
const { log } = require('debug');
router.use(bodyParser.json())


let sessions = []
let userMenu = new UssdMenu();
let registerMenu = new UssdMenu();


// Registered user userMenu


userMenu.sessionConfig({
    start: (sessionId, callback) => {
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        if(!(sessionId in sessions)) sessions[sessionId] = {};
        callback();
    },
    end: (sessionId, callback) => {
        // clear current session
        // this is called by menu.end()
        // Call register api here
        console.log(sessions[sessionId]);
        delete sessions[sessionId];
        callback();
    },
    set: (sessionId, key, value, callback) => {
        // store key-value pair in current session
        sessions[sessionId][key] = value;
        callback();
    },
    get: (sessionId, key, callback) => {
        // retrieve value by key in current session
        let value = sessions[sessionId][key];
        callback(null, value);
    }
});


userMenu.startState({
    run: () => {
        userMenu.session.set('user', userMenu.args.user)
        userMenu.con('Welcome to Dokutela, choose your language' +
            '\n1. English' +
            '\n2. Swahili' +
            '\n3. Setswana');
    },
    next: {
        '1': 'HomeMenu',
        '2': 'HomeMenu',
        '3': 'HomeMenu',
    },
    defaultNext: 'HomeMenu'
});

userMenu.state('HomeMenu', {
    // 
    run: () => {
        userMenu.con('Home Menu' +
            '\n1. Current order' +
            '\n2. New Priscription' +
            '\n3. Book Appointment' +
            '\n4. Current Medication');
    },
    next: {
        '1': 'CurrentOrder',
        '2': 'newPrescription',
        '3': 'Appointment',
        '4': 'Booked'
    },
    defaultNext: 'HomeMenu'
});

userMenu.state('newPrescription', {
    // 
    run: () => {
        userMenu.con('Prescription Menu' +
            '\n1. Recent Report' +
            '\n2. Checkup by System' +
            '\n3. Checkup by health care provider' +
            '\n4. Contact health care provider' +
            '\n5. Refill prescription' +
            '\n0. Go back');
    },
    next: {
        '1': 'RecentReport',
        '2': 'Quiz',
        '3': 'SelectDoctor',
        '4': 'ContactDoctor',
        '5': 'Booked',
        '0': 'HomeMenu'
    },
    defaultNext: 'HomeMenu'
});

userMenu.state('CurrentOrder', {
    run: () => {
        userMenu.con('Report id: 123,\nDate: 12-04-2021,\nDelivery date: 27-04-2021.' +
            '\n1. Show full Report' +
            '\n2. Current Location' +
            '\n3. Cancel Order' +
            '\n0. Go back'
            );
    },
    next: {
        '1': 'fullReport',
        '2': 'GetLocation',
        '3': 'CancelOrder',
        '0': 'HomeMenu'
    },
    defaultNext: 'HomeMenu'
});

async function getRecentReport(params) {
    try {
        const db_response = await db.query("SELECT * FROM reports WHERE patient_id=$1 ORDER BY id DESC LIMIT 3;",[params.user_id])
        let text = "  Recent Reports"
        db_response.rows.map((item, index) => (
            text = text +  '\n' + (index+1) + '. Report-' +item.id+'|'+(item.illness?"Ckecked":"Not Checked")
        ))
        text = text + '\n0. More\n#. Home Menu'
        return [text, db_response.rows]
    } catch (error) {
        let text = 'Connection error!\n# Go back'
        return [text]
    }    
}

userMenu.state('RecentReport', {
    run: () => {
        userMenu.session.get('user').then(data => {
            getRecentReport(data).then((item) => {
             console.log(item)
             userMenu.con(item[0])
        })
        })
    },
    next: {
        '1': 'fullReport',
        '2': 'fullReport',
        '3': 'fullReport',
        '0': 'MoreReport',
        '#': 'HomeMenu'
    },
    defaultNext: 'HomeMenu'
});

async function getFirstQue(params){
    try {
        const db_response = await db.query("SELECT * FROM question WHERE ques_id=1;")
        const db_report = await db.query("INSERT INTO reports(patient_id) VALUES($1) returning *;",[params.user_id])
        let text = db_response.rows[0].quest_text
        db_response.rows[0].ques_options.map((item, index) => (
            text = text +  '\n' + (index+1) + '. ' + item
        ))
        text = text + '\n#. FINISH'
        return [db_response.rows[0].ques_id, db_report.rows[0].id, text]
    } catch (error) {
        let text = 'Connection error!\n0 Restart checkup \n* Go back'
        return [text]
    }
    // const db_report = await db.query("INSERT INTO reports(patient_id) VALUES($1) returning *;",[params.user_id])
}

userMenu.state('Quiz', {
    run: () => {
        getFirstQue(userMenu.args.user).then(data => {
            userMenu.session.set('oldQuesId', data[0])
            userMenu.session.set('reportId', data[1])
            userMenu.session.set('isEnding', false)
            userMenu.con(data[2]);
        })
    },
    next: {
        '0': 'Quiz',
        '1': 'NextQuiz',
        '2': 'NextQuiz',
        '3': 'NextQuiz',
        '4': 'NextQuiz',
        '#': 'Report',
        '*': 'HomeMenu'
    },
    defaultNext: 'Quiz'
});

async function getNextQue(params) {
    try {
        const db_response = await db.query("SELECT * FROM question WHERE ques_id=$1;",[Number(params.oldQueId)+1])
        const db_report = await db.query("UPDATE reports SET ques_id = array_append(ques_id, $1), ans = array_append(ans, $2) WHERE id = $3;",
        [(params.oldQueId).toString(), (params.answer).toString(), params.reportId])
        let isEnding = false
            if(Number(db_response.rows[0].ques_id) > 5){
            isEnding = true
        }
        let text = db_response.rows[0].quest_text
        db_response.rows[0].ques_options.map((item, index) => (
            text = text +  '\n' + (index+1) + '. ' + item
        ))
        text = text + '\n#. FINISH'
        return [text, isEnding, db_response.rows[0].ques_id]
    } catch (error) {
        return ['Connection Error!\n0 Restart checkup \n* Go back']
    }
}

userMenu.state('NextQuiz', {
    run: () => {
        try {
            userMenu.session.get('isEnding').then(isEnd => {
                if(isEnd){
                    userMenu.con('--Checkup completed--\n#  Get report\n0  Re-check\n*  Home Menu');
                }else{
                    userMenu.session.get('oldQuesId').then(id1 => {
                        userMenu.session.get('reportId').then(id2 => {
                            let input ={
                                oldQueId: id1,
                                reportId: id2,
                                answer: userMenu.val
                            }
                            getNextQue(input).then(data => {
                                console.log(data);
                                userMenu.session.set('isEnding', data[1])
                                userMenu.session.set('oldQuesId', data[2])
                                userMenu.con(data[0]);
                            })
                        })
                    })
                }
            })
        } catch (error) {
            userMenu.con('Connection error!\n0 Restart checkup \n* Go back');
        }
    },
    next: {
        '0': 'Quiz',
        '1': 'NextQuiz',
        '2': 'NextQuiz',
        '3': 'NextQuiz',
        '4': 'NextQuiz',
        '5': 'NextQuiz',
        '6': 'NextQuiz',
        '7': 'NextQuiz',
        '#': 'Report',
        '*': 'HomeMenu'
    },
    defaultNext: 'NextQuiz'
});

userMenu.state('Report', {
    run: () => {
        userMenu.session.get('reportId').then(id => {
            userMenu.con('You are diagnosed, Report id: ' +id+
                '.\nChoose option:' +
                '\n1. Show full report' +
                '\n2. Order prescription' +
                '\n3. Contact doctor' +
                '\n4. Re-checkup' +
                '\n5. Main Menu' +
                '\n6. Exit'
            );
        })
    },
    next: {
        '1': 'fullReport',
        '2': 'Location',
        '3': 'Appointment',
        '4': 'Quiz',
        '5': 'HomeMenu',
        '6': 'Quit'
    },
    defaultNext: 'Report'
})

userMenu.state('fullReport', {
    run: () => {
        userMenu.con('You have fever!' +
            '\n1. Order prescription' +
            '\n2. Contact doctor' +
            '\n3. Go back');
    },
    next: {
        '1': 'Location',
        '2': 'Appointment',
        '0': 'Report'
    },
    defaultNext: 'Report'
})


userMenu.state('Location', {
    run: () => {
        userMenu.con('Enter your area pin code?');
    },
    next: {
        '*\\d+': 'Booked'
    },
    defaultNext: 'Booked'
});

userMenu.state('Booked', {
    run: () => {
        var location = Number(userMenu.val)
        userMenu.end('Your order is booked, our executive will call when order is ready to deliever');
    }
});

userMenu.state('Appointment', {
    run: () => {
        userMenu.end('Your Appointment is booked, our executive will call when docter is ready to checkup');
    }
});
userMenu.state('Quit', {
    run: () => {
        userMenu.end('Thanks for checking out our service');
    }
});




// Register Menu


registerMenu.startState({
    run: () => {
        registerMenu.end('You are not register, please contact nearest health care provider.');
    }
});


// async function registerUser(params) {
//     console.log(params);
//     try {
//         const db_res_1 = await db.query(
//             "insert into users(user_phone, user_name, user_pass, user_type, is_verified) values($1, $2, $3, $4, $5) returning *",
//             [params.phoneNumber, params.Name, params.Password, 'patient', false]
//         )
//         const db_res_2 = await db.query(
//             "insert into patient(patient_id, patient_phone, patient_age, patient_weight, patient_heart_rate, patient_temperature, patient_location, patient_pincode) values($1, $2, $3, $4, $5, $6, $7, $8) returning *;",
//             [db_res_1.rows[0].user_id, params.phoneNumber, params.Age, params.Weight, params.HeartRate, params.Temperature, params.Location, params.Pincode]
//         )
//         console.log('success !!');
//         return true
//     } catch (error) {
//         console.log('failed !!');
//         return false
//     }
// }

// registerMenu.sessionConfig({
//     start: (sessionId, callback) => {
//         // initialize current session if it doesn't exist
//         // this is called by menu.run()
//         if(!(sessionId in sessions)) sessions[sessionId] = {};
//         callback();
//     },
//     end: (sessionId, callback) => {
//         // clear current session
//         // this is called by menu.end()
//         // Call register api here
//         registerUser(sessions[sessionId])

//         delete sessions[sessionId];
//         callback();
//     },
//     set: (sessionId, key, value, callback) => {
//         // store key-value pair in current session
//         sessions[sessionId][key] = value;
//         callback();
//     },
//     get: (sessionId, key, callback) => {
//         // retrieve value by key in current session
//         let value = sessions[sessionId][key];
//         callback(null, value);
//     }
// });

// registerMenu.startState({
//     run: () => {
//         registerMenu.session.set('phoneNumber', registerMenu.args.phoneNumber)
//         registerMenu.con('Welcome to Dokuteaa, choose your language' +
//             '\n1. English' +
//             '\n2. Setswana' +
//             '\n3. Swahili');
//     },
//     next: {
//         '1': 'register',
//         '2': 'register',
//         '3': 'register',
//     }
// });

// registerMenu.state('register', {

//     run: () => {
//         registerMenu.con('You are not subscribed user.\nDo you want to subscribe?' +
//             '\n1. Yes' +
//             '\n3. No, I am already subscribed'
//         );
//     },
//     next: {
//         '1': 'register.name',
//         '2': 'register.confirmAccount'

//     }
// });
// registerMenu.state('register.name', {
//     run: () => {
//         registerMenu.con('Enter your name:');
//     },
//     next: {
//         '*[a-zA-Z]+': 'register.password'
//     },
//     defaultNext: 'register.name'
// });

// // Add vaildation
// registerMenu.state('register.password1', {
//     run: () => {
//         registerMenu.session.set('Name', registerMenu.val)
//         registerMenu.con('Set Password:');
//     },
//     next: {
//         '*[a-zA-Z]+': 'register.password2'
//     },
//     defaultNext: 'register.password1'
// });

// registerMenu.state('register.password2', {
//     run: () => {
//         registerMenu.session.set('password1', registerMenu.val)
//         registerMenu.con('Set Password:');
//     },
//     next: {
//         '*[a-zA-Z]+': 'register.age'
//     },
//     defaultNext: 'register.password'
// });

// registerMenu.state('register.age', {
//     run: () => {
//         if(registerMenu.val.length >= 4){
//             registerMenu.session.set('Password', registerMenu.val)
//         }
//         registerMenu.con('Enter your age?');
//     },
//     next: {
//         '*\\d+': 'register.location'
//     },
//     defaultNext: 'register.age'
// });


// registerMenu.state('register.location', {
//     run: () => {
//         registerMenu.session.set('Age', registerMenu.val)
//         registerMenu.con('Enter your Address:');
//     },
//     next: {
//         '*[a-zA-Z]+': 'register.pincode'
//     },
//     defaultNext: 'register.pincode'
// });

// registerMenu.state('register.pincode', {
//     run: () => {
//         registerMenu.session.set('Location', registerMenu.val)
//         registerMenu.con('Enter your pincode:');
//     },
//     next: {
//         '*\\d+': 'register.showDetails'
//     },
//     defaultNext: 'register.showDetails'
// });

// registerMenu.state('register.showDetails', {
//     run: () => {
//         registerMenu.session.set('Pincode', registerMenu.val)
//         registerMenu.session.get('Name').then(name => {
//             registerMenu.end('Welcome! '+name+', You are registered now.'+
//             '\nRedial to use our service');
//         })
//     }
// });

// registerMenu.state('register.quit', {
//     run: () => {
//         registerMenu.end('Thanks for Visiting, you are always welcome');
//     }
// });

// registerMenu.state('register.confirmAccount', {
//     run: () => {
//         registerMenu.end('Thanks for Visiting, we are working on this feature.');
//     }
// });

// registerMenu.on('error', (err) => {
//     console.log('Error', err);
//     registerMenu.end('Poor internet connection, Try again!');
// });

router.post('/', async (req, res) => {
    
    try {
        const user = await db.query("select * from users where user_phone = $1;", [req.body.phoneNumber]);
        if(user.rows.length === 0){
            let args = {
                phoneNumber: req.body.phoneNumber,
                sessionId: req.body.sessionId,
                serviceCode: req.body.serviceCode,
                text: req.body.text
            };
            registerMenu.run(args, resMsg => {
                res.send(resMsg);
            });
        }else{
            let args = {
                phoneNumber: req.body.phoneNumber,
                sessionId: req.body.sessionId,
                serviceCode: req.body.serviceCode,
                text: req.body.text,
                user: user.rows[0]
            };
            userMenu.run(args, resMsg => {
                res.send(resMsg);
            });
        }   
    } catch (error) {
        userMenu.run(args, resMsg => {
            res.send(resMsg);
        });
    }
});

module.exports = router;
