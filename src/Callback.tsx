import { completeLogin } from './spotify'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export const Callback = () => {
	const history = useHistory()

  useEffect(() => {
    completeLogin()
      .then(() => {
		history.push('/dashboard')
	})
      .catch((error: any) => {
        console.error(error)
      })
  }, [])

  return (
    <div>
		logger ind ...
    </div>
  )
}
