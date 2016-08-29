var Promise = require('bluebird');
var router = require('express').Router();
var models = require('../db').models;
var SalesPerson = models.SalesPerson;
var Region = models.Region;
var SalesPersonRegion = models.SalesPersonRegion;

module.exports = router;

router.get('/',function(req,res,next){
	Promise.all([
		SalesPerson.findAll({include: [Region],order: 'name ASC'}),
		Region.findAll()
	])
	.spread(function(people,regions){

		//console.log('people',people);
		res.render('salesPeople',{
			title: 'Sales People',
			mode: 'salesPeople',
			people: people,
			regions: regions
		});
	})
	.catch(next);
});

router.post('/',function(req,res,next){
	//create new sales person
	SalesPerson.create({
		name: req.body.name
	})
	.then(function(){
		res.redirect('/salesPeople');
	})
	.catch(next);
	
});

router.delete('/:salesPersonId',function(req,res,next){
	//delete sales person by ID and return to page
	SalesPerson.destroy({
		where:{
			id: req.params.salesPersonId
		}
	})
	.then(function(){
		res.redirect('/salesPeople');
	})
	.catch(next);
});

router.post('/:salesPersonId/:regionId',function(req,res,next){
	Promise.all([
		SalesPerson.findById(req.params.salesPersonId),
		Region.findById(req.params.regionId)
	])
	.spread(function(person,region){
		return person.addRegion(region);
	})
	.then(function(){
		console.log('go back to: ',req.query.backUrl);
		res.redirect(req.query.backUrl);
	})
	.catch(next);
});

router.delete('/:salesPersonId/:regionId',function(req,res,next){
	//delete association
	Promise.all([
		SalesPerson.findById(req.params.salesPersonId),
		Region.findById(req.params.regionId)
	])
	.spread(function(person,region){
		return person.removeRegion(region);
	})
	.then(function(){
		console.log('go back to: ',req.query.backUrl);
		res.redirect(req.query.backUrl);
	})
	.catch(next);
});