import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { CLIENT_ID } from './secret'
import React from 'react'
import {
	BrowserRouter as Router,
	Route,
  } from "react-router-dom"
import { Login } from './Login'
import { Callback } from './Callback'
import { Dashboard } from './Dashbord'
  
  const App = () => {
	return (
		<Router>
			<Route path="/" exact>
				<Login />
			</Route>
			<Route path="/callback">
				<Callback />
			</Route>
			<Route path="/dashboard">
				<Dashboard />
			</Route>
		</Router>
	)
}
	
export default App
		