const mongodb = require('mongodb');

class Db{

	constructor(){
		this.mongoClient = mongodb.MongoClient;
		this.ObjectID = mongodb.ObjectID;
	}

	onConnect(){
		const mongoURL = process.env.MONGODB_URL;
		return new Promise( (resolve, reject) => {
			this.mongoClient.connect(mongoURL, (err, db) => {
				if (err) {
					reject(err);
				} else {
					// console.log("mongodb connected")
					resolve([db,this.ObjectID]);
				}
			});
		});
	}
}
module.exports = new Db();
