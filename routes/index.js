var express = require('express');
var router = express.Router();
var config = require('../config/config')

// copied from https://www.npmjs.com/package/mysql
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  // dont ever use 'root', make an individual user for each app
  password : config.password,
  database : config.database
});

// after this line runs, we are connected to mySQL!
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	// init array as a placeholder
	var taskArray = [];
	// see if there is a message in the query string!
	var msg = req.query.msg;
	if(msg === 'updated'){
		msg = 'Your post has been updated'
	}
	// res.send(msg);
	var selectQuery = "SELECT * FROM tasks";
	connection.query(selectQuery, (error, results, field)=>{
		// res.json(results)
		res.render('index', { taskArray: results, msg:msg });
	})
	
});

router.post('/addNew', (req, res, next)=>{
	// res.json(req.body);
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var insertQuery = 'INSERT INTO tasks (task_name, task_date) VALUES ("' + newTask + '","' + taskDate + '")';
	// res.send(insertQuery);
	connection.query(insertQuery, (error, results, field)=>{
		if(error) throw error;
		res.redirect('/')
	});
	// we have a mysql connection called connection
});

//INDEX  >>> 1. get.DELETE    2. get.UPDATE    3. post.ADD

////////////////////////////////////
//////////////Edit Get//////////////
////////////////////////////////////
router.get('/edit/:id', (req, res, next)=>{
	// res.send(req.params.id);
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(selectQuery);
	connection.query(selectQuery, (error,results,fields)=>{
		// res.json(results);
		// var date = results[0].task_date;
		var days = results[0].task_date.getDate();
		if(days < 10){
			days = "0"+days;
		}
		var months = results[0].task_date.getMonth() + 1;
		if(months < 10){
			months = "0"+months;
		}		
		var years = results[0].task_date.getFullYear();
		var mysqlDate = years + '-' + months + '-' + days;
		results[0].task_date = mysqlDate;
		// res.json(date);
		res.render('edit', { task:results[0] } );
	})
});



// ////////////////////////////////////
// //////////////Edit POST/////////////
// ////////////////////////////////////
router.post('/edit/:id', (req, res, next)=>{
	var id = req.params.id
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
	var updateQuery = 'UPDATE tasks SET task_name="' + newTask + '", task_date="' + taskDate +  '" WHERE id =' + id
	// res.send(updateQuery);
	// res.send(req.params.id);
	// id is in the req.params, task_name and task_date are in req.body
	connection.query(updateQuery, (error,results,fields)=>{
		if(error) throw error;
		res.redirect('/?msg=updated')
	})
});


// ////////////////////////////////////
// //////////////Edit GET//////////////
// ////////////////////////////////////
router.get('/delete/:id', (req, res, next)=>{
	// res.send(req.params.id);
	var deleteQuery = "DELETE FROM tasks WHERE id =" + req.params.id;
	// res.send(selectQuery);
	connection.query(deleteQuery, (error,results,fields) => {
		if(error) throw error;
		res.redirect('/');
	})
});

// outer.post('/delete/:idxx', (req, res, next)=>{

// 	res.send(req.params.idxx);
// });
////////////////////////////////////
//////////////Edit POST/////////////
////////////////////////////////////
module.exports = router;

