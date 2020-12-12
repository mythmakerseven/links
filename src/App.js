import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import SingleUser from './components/SingleUser'
import Users from './components/Users'
import SingleLink from './components/SingleLink'
import Home from './components/Home'
import RegisterForm from './components/RegisterForm'

import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logOutUser } from './reducers/userReducer'
import { getAllUsers } from './reducers/userInfoReducer'

import Container from '@material-ui/core/Container'

import { AppBar, Toolbar, Button, Typography } from '@material-ui/core'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import {
  Switch, Route, Link,
  useRouteMatch
} from 'react-router-dom'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009688',
    },
    secondary: {
      main: '#ec407a',
    },
  },
})

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  const user = useSelector(({ user }) => user)

  const users = useSelector(({ userInfo }) => userInfo)

  const blogs = useSelector(({ blogs }) => blogs)

  const handleLogout = async (event) => {
    event.preventDefault()
    dispatch(logOutUser())
  }

  const userMatch = useRouteMatch('/users/:id')
  const userToShow = userMatch
    ? users.find(user => user.id === String(userMatch.params.id))
    : null

  const linkMatch = useRouteMatch('/links/:id')
  const linkToShow = linkMatch
    ? blogs.find(blog => blog.id === String(linkMatch.params.id))
    : null

  if (!user) {
    return (
      <div>
        <h2>Welcome. Please sign in to view this application.</h2>
        <Notification />
        <LoginForm />
        <RegisterForm />
      </div>
    )
  }

  return (
    <Container>
      <ThemeProvider theme={theme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">Links</Button>
            <Button color="inherit" component={Link} to="/users">Users</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <div style={{ flexGrow: 1 }}></div>
            <Typography>Hello, {user.name}</Typography>
            <Button id="logout" color="inherit" onClick={handleLogout}>Log out</Button>
          </Toolbar>
        </AppBar>

        <Notification />

        <Switch>
          <Route path="/links/:id">
            <SingleLink link={linkToShow}/>
          </Route>
          <Route path="/users/:id">
            <SingleUser user={userToShow} />
          </Route>
          <Route path="/users">
            <Users users={users}/>
          </Route>
          <Route path="/about">
            <Home />
          </Route>
          <Route path="/">
            <BlogList />
          </Route>
        </Switch>
      </ThemeProvider>
    </Container>
  )
}

export default App