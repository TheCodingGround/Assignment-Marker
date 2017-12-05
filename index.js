const express = require('express')
var bodyParser = require('body-parser')

const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile); // (A)

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

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
    var result = await readFileAsync('./assignments.json', {encoding: 'utf8'})
    var parsed = JSON.parse(result);
    var assignment = parsed.find(a => a.name == assignmentName);
    return assignment;
}

app.listen(3000, () => console.log('Example app listening on port 3000!'))
