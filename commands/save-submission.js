var Promise = require("bluebird");
var MongoDB = require("mongodb");
Promise.promisifyAll(MongoDB);

//const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'tcg-marker';

var client;
var db;

async function connect(dbName){
  client = await MongoDB.connect(url);
  db = client.db(dbName);
}


module.exports = async function save(submission, result){
  if (!client){
    await connect("marker");
  }

  var collection = db.collection('submissions');

  var inserted = await collection.insert({...submission, result: result});
  console.log('inserted', inserted);


  //client.close();
};

// Use connect method to connect to the server
