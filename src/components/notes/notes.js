import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';

export default class Notes extends Component {
  state = {
    userNotes: ''
  }

  componentDidMount = () => {
    const savedNotes = localStorage.getItem(this.props.user);
    if (savedNotes) {
      this.setState({userNotes: savedNotes})
    }
  }

  handleChange = (event) => {
    localStorage.setItem(this.props.user, event.target.value)
    this.setState({userNotes: event.target.value})
  }

  render() {
    const { userNotes } = this.state

    return (
      <Grid item xs={12}>
        <h3>Anotações</h3>
        <TextField rows="4" value={userNotes} multiline={true} onChange={this.handleChange} InputLabelProps={{ shrink: true, }} placeholder={`Anotações de ${this.props.user} (salvo automaticamente)`} fullWidth margin="normal" />
      </Grid>
    )
  }
}
