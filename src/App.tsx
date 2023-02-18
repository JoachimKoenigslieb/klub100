import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { CLIENT_ID } from './secret'
import React from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
  } from "react-router-dom"
import { Login } from './Login'
import { Callback } from './Callback'
import { Dashboard } from './Dashbord'
  
  const App = () => {

	return (
		<Router>
			<Route path="/klub100/" exact>
				burde log in
				<Login />
			</Route>
			<Route path="/klub100/callback">
				Run taht shit
			</Route>
			<Route path="/klub100/callback">
				<Callback />
			</Route>
			<Route path="/klub100/dashboard">
				<Dashboard />
			</Route>
		</Router>
  )
}

		
export default App
		