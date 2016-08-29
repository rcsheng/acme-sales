var express = require('express');
var app = express();
var db = require('./db');
var SalesPerson = db.models.SalesPerson;
var Region = db.models.Region;
//var Sequelize = require('sequelize');

var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var swig = require('swig');
swig.setDefaults({cache: false});


swig.setFilter('containsZip', function(regions, userRegion) {
	//console.log('swig filter: ',regions, userRegion);
  	return (regions.find(function(region){
	  	return (region.id === userRegion.id)
	  		
	  }) != null);
});

swig.setFilter('containsPerson', function(people, userPerson) {
	//console.log('swig filter: ',regions, userRegion);
  	return (people.find(function(person){
	  	return (person.id === userPerson.id)
	  		
	  }) != null);
});

app.use(express.static(path.join(__dirname,'node_modules')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.engine('html',swig.renderFile);
app.set('view engine','html');


app.get('/',function(req,res,next){

	Region.findAll()
	.then(function(regions){
		res.render('index',{
			title: 'Home Page',
			mode: 'home',
			regions: regions
		});
	})
	.catch(next);
});

app.use('/salesPeople', require('./routes/salesPeople'));
app.use('/regions', require('./routes/regions'));

module.exports = app;