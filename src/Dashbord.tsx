import { usePlaylists } from "./useUser"
import { AudioRecorder } from 'react-audio-voice-recorder';

const addAudioElement = (blob: any) => {
	console.log('adding audio element...')
	const url = URL.createObjectURL(blob);
	const audio = document.createElement("audio");
	audio.src = url;
	audio.controls = true;
	document.body.appendChild(audio);
  };

  
export const Dashboard = () => {
	const { data, } = usePlaylists()

	console.log(data)
	console.log('yoyoyoyooy')
	return (
		<div>
			dine playlister:

			<AudioRecorder onRecordingComplete={addAudioElement} />
			

		</div>
	)
}