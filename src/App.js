import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import userService from './services/index';
import Moment from 'react-moment';
import UserNotes from './components/notes/notes';
import NotFound from './components/notFound/notFound';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    textalign: 'center',
  },
  button: {
    margin: '15px 0px',
  },
  input: {
    display: 'none',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  avatar: {
    borderradius: '4px',
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: '',
      userSearch: '',
      img: '',
      label: 'Usuário do GitHub',
      loading: false,
      repos: [],
      currentPage: 1,
      perPage: 3,
      userNotes: '',
    };
  }

  onChange = (event) => {
    this.setState({ userSearch: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({user: null, currentPage: 1, loading: true, repos: []})

    userService.getUser(this.state.userSearch, user => {
     this.setState({ user })

     if(user.message === 'Not Found')
      this.setState({loading: false})

     if (user.login) {
        userService.getUserRepos(user.login, userRepos => {
          this.setState({repos: userRepos, loading: false})
        }, error => {
          this.setState({loading: false})
          console.log('error', error)
        })
      }
    }, error => {
      this.setState({user: null, loading: false})
      console.log('error', error)
    })
  }

  handleClick = (page) => () => {
    this.setState({
      currentPage: page
    });
  }

  render() {
    const { classes } = this.props;
    const buttonSearch = this.state.userSearch ? (
      <Button type="submit" variant="raised" color="primary" className={classes.button}>Buscar</Button>
    ) : (
      <Button variant="raised" className={classes.button} disabled={true}>Buscar</Button>
    );
    const loadUser = this.state.loading ? (
      <CircularProgress className={classes.progress} />
    ) : (
      ''
    );
    const { user, repos, currentPage, perPage, loading } = this.state
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const current = repos.slice(indexOfFirst, indexOfLast);

    return (
      <div className="App">
        <Grid container spacing={24}>
          <Grid item xs={12} className="App-text-center">
            <form onSubmit={this.handleSubmit}>
              <FormControl className={classes.formControl} fullWidth={true}>
                <InputLabel htmlFor="login">{this.state.label}</InputLabel>
                <Input id="login" value={this.state.userSearch} onChange={this.onChange} autoComplete="off" />
                {buttonSearch}
              </FormControl>
            </form>
            {loadUser}
          </Grid>
          {user && user.message &&
            <NotFound />
          }
          {!loading && user && !user.message &&
          <Grid item xs={12} sm={3}>
            <img src={user.avatar_url} alt={user.login} className="App-logo" />
            <h3>{user.login}</h3>
            <p>Criado em: <Moment format="DD/MM/YYYY">{ user.created_at }</Moment></p>
            {user.location &&
              <p>Localização: { user.location }</p>
            }
            <p>Repositórios públicos: { user.public_repos }</p>
            <p>Seguidores: { user.followers }</p>
            <p>Seguindo: { user.following }</p>
            <a href={user.html_url} rel="noopener noreferrer" target="_blank">Ver no GitHub</a>
          </Grid>
          }
          <Grid item xs={12} sm={9}>
            {current.map((repos, index) => (
              <div className="App-repositories" key={index}>
                <p>Nome: { repos.name }</p>
                <p>Criado em: <Moment format="DD/MM/YYYY">{ repos.created_at }</Moment></p>
                <p>Link: <a href={repos.html_url} rel="noopener noreferrer" target="_blank">ver no GitHub</a></p>
                {repos.description &&
                  <p>Descrição: { repos.description }</p>
                }
              </div>
            ))}
            <ul className="App-ul">
              {indexOfFirst > 0 &&
                <li className="prev" onClick={this.handleClick(currentPage - 1)}>
                  <a>Anterior</a>
                </li>
              }
              {indexOfLast < repos.length &&
                <li className="next" onClick={this.handleClick(currentPage + 1)}>
                  <a>Próximo</a>
                </li>
              }
            </ul>
            {!loading && user && !user.message &&
            <Grid item xs={12}>
              <UserNotes user={user.login} />
            </Grid>
            }
          </Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
