const express = require('express');
var bodyParser = require('body-parser');

const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile); // (A)

const app = express();

app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/assignments',async (req,res) => {
  var assignments = await getAssignments();

  var results = assignments.map((a) => {
    return {
      name: a.name,
      description: a.description
    };
  });

  res.json(results);
});

app.post('/assignment/submit', async function(req,res){
    const {NodeVM} = require('vm2');

    const vm = new NodeVM({
        timeout: 1000,
        sandbox: {},
        wrapper: 'none'
    });

    try {

        var assignment = await getAssignment(req.body.assignment);
        var testResults = [];

        for (var test of assignment.tests) {
            console.log(req.body.code + ";" + test);
            var codeResult = vm.run(req.body.code + "; return " + test);
            testResults.push({
                result: codeResult,
                test: test
            });
        }

        res.json({result: testResults});
    }
    catch(e) {
        console.log(e);
        res.sendStatus(400).end(e.message);
    }
});


async function getAssignment(assignmentName){
  var assignments = getAssignments();
    var assignment = assignments.find(a => a.name == assignmentName);
    return assignment;
}

async function getAssignments(){
  var result = await readFileAsync('./assignments.json', {encoding: 'utf8'});
  return JSON.parse(result);
}

app.listen(3000, () => console.log('Example app listening on port 3000!'))
