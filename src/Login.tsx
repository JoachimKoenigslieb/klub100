import { useEffect } from "react"
import { Redirect, useHistory } from 'react-router-dom'
import useUser from "./useUser"
import { beginLogin } from './spotify.js'

export const Login = () => {
	const { user } = useUser()
	const history = useHistory()

	console.log('user', user)
	
	useEffect(() => {
		if (user) {
			history.push('/klub100/dashboard')
		}
	  }, [user])
	
	
	return (
		<div>
			login min g?
				<button onClick={async () => {
					await beginLogin()
				}}>
					log ind
				</button>
			`
		</div>
	)
} 