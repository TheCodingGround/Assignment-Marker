import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import rp from 'request-promise';

class App extends Component {
    constructor(props){
        super(props)
        this.state = {assignments: []};
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

  render() {
      var assignments = this.state.assignments.map((a) => {
          return <div>
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
                  <p className="App-intro">
                      {body}
                  </p>
              </div>
          );
  }

    submitAssignmentComponent(assignment) {
        return (<div>
                 <h1>{assignment.name}</h1>
                 <h3>{assignment.description}</h3>
                 <input type="text"></input><br/>
                 <textarea></textarea><br/>
                 <button>Submit</button>
        </div>);

    }
}

export default App;
