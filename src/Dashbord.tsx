import { usePlaylist, usePlaylists, useTracks } from "./useUser";
import { AudioRecorder } from "react-audio-voice-recorder";
import styled from "styled-components";
import { fetchWithToken } from './spotify.js'
import { Link, Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { useState } from "react";

const addAudioElement = (blob: any) => {
  console.log("adding audio element...");
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

const PlaylistListItem = styled.div`
  :hover {
    background-color: grey;
    cursor: pointer;
  }
`;

const startPlaying = (song: string) => {
	return fetchWithToken('https://api.spotify.com/v1/me/player/play', {
		method: 'PUT',
		body: JSON.stringify({
			'context_uri': song,
		})
	})
}

const toNext = () => {
	return fetchWithToken('https://api.spotify.com/v1/me/player/next', {
		method: 'POST',
	})
}

const Clock = (props: { time: number, }) => {
	return (
		<div>
			{props.time}
		</div>
	)
}

const Player = () => {
	const { id } = useParams();
	const { data: playlist } = usePlaylist(id)

	console.log(playlist)
	const [ time, setTime, ] = useState(60)

	if (time === 0) {
		// go to next song!
		toNext()
		setTime(60)
	}

  return (
    <>
      <div>
        <Link to="/klub100/dashboard">tilbage</Link>
      </div>
		<h2>
			{playlist?.name}
		</h2>
		<img src={playlist?.images?.[0]?.url}/>
	  <Clock time={time}/>
	  <button onClick={() => {
		startPlaying(`spotify:playlist:${id}`)
		setInterval(() => {
			setTime(curTime => curTime - 1)
		}, 1000)
	}}>
		start KLUB 100
	  </button>
    </>
  );
};

export const Dashboard = () => {
  const { data } = usePlaylists();

  if (!data) {
    return <div>ka ik finde dine playliste:</div>;
  }

  return (
    <div>
      {/* <AudioRecorder onRecordingComplete={addAudioElement} /> */}
      <Switch>
        <Route path={"/klub100/dashboard"} exact>
      		<h2>dine playlister:</h2>
          {data.items.map((playlist) => {
            return (
              <PlaylistListItem key={playlist.id}>
                <Link to={`/klub100/dashboard/${playlist.id}`}>
                  {playlist.name}
                </Link>
              </PlaylistListItem>
            );
          })}
        </Route>
        <Route path={"/klub100/dashboard/:id"}>
			<Player />
		</Route>
      </Switch>
    </div>
  );
};
