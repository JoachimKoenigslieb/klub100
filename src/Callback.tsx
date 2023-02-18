import { completeLogin } from './spotify.js'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export const Callback = () => {
	const history = useHistory()

  useEffect(() => {
    completeLogin()
      .then(() => {
		history.push('/klub100/dashboard')
	})
      .catch((error: any) => {
        console.error(error)
        alert('bad stuff erro')
      })
  }, [])

  return (
    <div>
		logger ind ...
    </div>
  )
}
