import useSWR from 'swr'
import { fetchWithToken } from './spotify.js'

export default function useUser() {
  const { data, mutate, error } = useSWR(
    'https://api.spotify.com/v1/me',
    fetchWithToken,
  )

  return {
    user: data,
    mutate,
    loggedOut: error?.status === 401,
  }
}

export const usePlaylists = () => {
	const { data, mutate, error, } = useSWR(
		'https://api.spotify.com/v1/me/playlists',
		fetchWithToken,
	)

	console.log('error?', error)

	return {
		data, 
	}
}