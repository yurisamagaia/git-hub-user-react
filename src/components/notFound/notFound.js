import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

export default class NotFound extends Component {
  state = {
    msgm: 'Erro 404. Nenhum usuário encontrado, tente novamente.'
  }

  render() {
    const { msgm } = this.state

    return (
      <Grid item xs={12}>
        <h3>{msgm}</h3>
      </Grid>
    )
  }
}
