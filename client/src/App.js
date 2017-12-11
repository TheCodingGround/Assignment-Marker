import React, { Component } from 'react';
import './App.css';
import rp from 'request-promise';

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            assignments: [],
            code: "",
            name: "",
            submissionResult: []
        };
        this.getAssignments();
    }

    getAssignments() {
        rp('http://localhost:3000/assignments', { json:true })
            .then((assignments) => {
                this.setState({assignments, currentAssignment: null});
            })
            .catch(function (err) {
                alert(err.message);
            });
    }


    setValue(e){
        var key = e.target.name;
        var value = e.target.value;

        var state = this.state;

        state[key] = value;

        this.setState({...state});
    }

    submitAssignment(){
        var options = {
            method: 'POST',
            uri: 'http://localhost:3000/assignment/submit',
            body: {
                assignment: this.state.currentAssignment.name,
                code: this.state.code,
                name: this.state.name
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then((data) =>{
                console.log('result', data);
                this.setState({submissionResult: data.result});
            })
            .catch(e => {
                console.error(e)
            });
    }

    render() {
        var assignments = this.state.assignments.map((a) => {
            return <div key={a.name}>
                <h1>{a.name}<button onClick={() => {this.setState({currentAssignment: a})}}>Submit</button></h1>
                <div>{a.description}</div>
            </div>;
        });


        var body = this.state.currentAssignment ?
                   this.submitAssignmentComponent(this.state.currentAssignment)
                 : assignments;

        return (
            <div className="App">
                <header className="App-header">
                    The Coding Ground Assignments
                </header>
                <div className="App-intro">
                    {body}
                </div>
            </div>
        );
    }

    submitAssignmentComponent(assignment) {
        return (<div key={assignment.name}>
            <h1>{assignment.name}</h1>
            <h3>{assignment.description}</h3>
            <div><label>Name</label>
                <input name="name" type="text" onChange={(e) => this.setValue(e)}></input><br/>
            </div>
            <br/>
            <div>
                <label>Submission</label>
                <textarea name="code" rows="10" columns="30" onChange={(e) => this.setValue(e)}></textarea>
                <br/>
            </div>
            <code>{this.state.code}</code>
            <br/>
            <button onClick={() => this.submitAssignment()}>Submit</button>
            <br/>
            <div>
                <ul>
                {this.state.submissionResult.map(r => 
                    <li key={r.test}>{r.test } : {r.passed === true ? "Passed" : "Failed" }</li>
                )}
                    </ul>
            </div>

        </div>);

    }
}

export default App;
