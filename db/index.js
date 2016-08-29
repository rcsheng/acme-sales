var Sequelize = require('sequelize');

var db = new Sequelize(process.env.DATABASE_URL,{
	logging:false
});

var SalesPerson = db.define('salesPerson',{
	name: Sequelize.STRING
});

var Region = db.define('region',{
	zip: Sequelize.STRING
});

var SalesPersonRegion = db.define('salesPersonRegion');

SalesPerson.belongsToMany(Region, { through: SalesPersonRegion });
Region.belongsToMany(SalesPerson, { through: SalesPersonRegion });
// through is required!


function sync() {
	return db.sync({force: true});
}

function seed() {
	return sync()
	.then(function(){
		return Promise.all([
			SalesPerson.create({name: 'Moe'}),
			SalesPerson.create({name: 'Larry'}),
			Region.create({zip: '10019'}),
			Region.create({zip: '90210'})]);
	});

}

module.exports =
{
	sync: sync,
	seed: seed,
	models: {
		SalesPerson: SalesPerson,
		Region: Region,
		SalesPersonRegion	
	}
};