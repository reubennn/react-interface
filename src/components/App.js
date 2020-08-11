import React, { Component } from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import { without } from 'lodash';

class App extends Component {

  constructor() {
    super(); // Allow you to get information from the parent component
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc', // ascending
      queryText: '',
      lastIndex: 0
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
  };

  componentDidMount() {
    fetch("./data.json") // After app is assembled, it will be in the same folder
      .then(response => response.json()) // Promise
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        })
        this.setState({
          myAppointments: apts
        });
      });
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    });
  }

  searchApts(query) {
    this.setState({ queryText: query })
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    })
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt); // Adds item to start of array (opposite of push)
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({
      myAppointments: tempApts
    });
  }

  render() {
    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    // Filter the appointments depending on this.state.orderDir (e.g. 'asc') and this.state.orderBy (e.g. petName)
    filteredApts = filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order; // if a is less than b, we return -1 (or 1 if not ascending)
      } else {
        return 1 * order; // if a is greater than b, we return 1 (or -1 if not ascending)
      }
    }).filter(eachItem => {
      return (
        // If the item matches the query, then it will return true to the filter
        eachItem['petName'] // Check the pet name
          .toLowerCase() // Case insensitive
          .includes(this.state.queryText.toLowerCase()) || // Check if the query exists in the item
        eachItem['ownerName'] // and check the owner name
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'] // and check the appointment notes
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase())
      );
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts} />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment} />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  };
}

export default App;
