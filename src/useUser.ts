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

type Playlist = {
	description: string,
	id: string,
	name: string,
	tracks: {
		href: string,
		total: number,
	},
	images: Array<{
		width: number,
		height: number,
		url: string,
	}>
}

export const usePlaylists = () => {
	const { data, mutate, error, } = useSWR<{ items: Playlist[]}>(
		'https://api.spotify.com/v1/me/playlists',
		fetchWithToken,
	)

	console.log('error?', error)

	return {
		data, 
	}
}

export const usePlaylist = (id: string) => {
	const { data, mutate, error, } = useSWR<Playlist>(
		`https://api.spotify.com/v1/playlists/${id}`,
		fetchWithToken,
	)

	return {
		data, 
	}
}

type Track = {
	track: {
		uri: string,
	}
}

export const useTracks = (id: string) => {
	const { data, mutate, error, } = useSWR<{ items: Track[], }>(
		`https://api.spotify.com/v1/playlists/${id}/tracks`,
		fetchWithToken,
	)
	
	if (!data) {
		return { data: { items: [], }, }
	}
	
	return {
		data, 
	}

}