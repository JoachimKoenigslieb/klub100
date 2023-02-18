import { useEffect } from "react"
import { Redirect, useHistory } from 'react-router-dom'
import useUser from "./useUser"
import { beginLogin } from './spotify'
import styled from "styled-components"

export const Login = () => {
	const { user } = useUser()
	const history = useHistory()
	
	useEffect(() => {
		if (user) {
			history.push('/dashboard')
		}
	  }, [user])
	
	
	return (
		<div>
			<h1>Klub 100</h1>
				<button onClick={async () => {
					await beginLogin()
				}}>
					Log ind
				</button>
		</div>
	)
} 