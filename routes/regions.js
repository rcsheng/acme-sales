var Promise = require('bluebird');
var router = require('express').Router();
var models = require('../db').models;
var SalesPerson = models.SalesPerson;
var Region = models.Region;
var SalesPersonRegion = models.SalesPersonRegion;

module.exports = router;

router.get('/',function(req,res,next){
	console.log('in regions router');
	Promise.all([
		SalesPerson.findAll(),
		Region.findAll({include: [SalesPerson],order: 'zip ASC'})
	])
	.spread(function(salesPeople, regions){
		res.render('regions',{
			title: 'Regions',
			mode: 'regions',
			people: salesPeople,
			regions: regions
		});
	})
	.catch(next);
});

router.post('/',function(req,res,next){
	//create new sales person
	Region.create({
		zip: req.body.zip
	})
	.then(function(){
		res.redirect('/regions');
	})
	.catch(next);
	
});

router.delete('/:id',function(req,res,next){
	//delete sales person by ID and return to page
	Region.destroy({
		where:{
			id: req.params.id
		}
	})
	.then(function(){
		res.redirect('/regions');
	})
	.catch(next);
});
