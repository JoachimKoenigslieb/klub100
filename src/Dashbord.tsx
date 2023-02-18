import { usePlaylists } from "./useUser"

export const Dashboard = () => {
	const { data, } = usePlaylists()

	console.log(data)
	console.log('yoyoyoyooy')
	return (
		<div>
			dine playlister:
			hva sker der
			der er sku da al mulig
		</div>
	)
}