import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";

const songs = [
  "/media/music/01. Porky Walk.mp3",
  "/media/music/02. Porky AI.mp3",
  "/media/music/03. Wen Nite.mp3",
  "/media/music/04. Dat Shit.mp3",
  "/media/music/05. We Friends.mp3",
  "/media/music/06. Sexy Mfr.mp3",
  "/media/music/07. Porky Add2.mp3",
].map((str) => str.replaceAll(" ", "%20"));

const MusicPlayer = () => {
  //   const [player, setPlayer] = useState<HTMLAudioElement>()
  const [player, setPlayer] = useState();
  const [playing, setPlaying] = useState(false);
  const volume = 0.5;

  useEffect(() => {
    const _player = new Audio();
    setPlayer(_player);
  }, []);

  const pause = useCallback(() => {
    if (player) {
      player.pause();
      setPlaying(false);
    }
  }, [player]);

  const getAlbumIndex = useCallback(() => {
    if (!player) return 0;

    const foundIdx = songs.findIndex(
      (str) => window.location.origin + str === player.src
    );
    const albumIdx =
      foundIdx !== -1 ? foundIdx : Math.floor(Math.random() * songs.length);
    return albumIdx;
  }, [player]);

  const playPrev = useCallback(() => {
    if (player) {
      if (playing) pause();

      let albumIdx = getAlbumIndex() - 1;
      if (albumIdx < 0) {
        albumIdx = songs.length - 1;
      }

      player.src = songs[albumIdx];
      player.volume = volume;
      player.play();
      setPlaying(true);
    }
  }, [player, getAlbumIndex, pause, playing, volume]);

  const playNext = useCallback(() => {
    if (player) {
      let albumIdx = getAlbumIndex() + 1;
      if (albumIdx >= songs.length) {
        albumIdx = 0;
      }

      if (playing) pause();

      player.src = songs[albumIdx];
      player.volume = volume;
      player.play();
      setPlaying(true);
    }
  }, [player, getAlbumIndex, pause, playing, volume]);

  const play = useCallback(() => {
    if (player) {
      if (!player.src) {
        player.src = songs[getAlbumIndex()];
      }

      player.onended = () => playNext();
      player.volume = volume;
      player.play();
      setPlaying(true);
    }
  }, [player, getAlbumIndex, playNext, volume]);

  const [playedOnMount, setPlayedOnMount] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (player && !playedOnMount) {
        play();
        setPlayedOnMount(true);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, [player, play, playedOnMount]);

  return (
    <div className="musicContainer">
      {/* <img className="radioImg" src="./images/Radio_img.png" alt="" /> */}
      <p>MUSIG PLAYUR</p>
      <div className="musicBox">
        {songs.length > 1 ? (
          <button onClick={() => playPrev()} className="prevBtn">
            <ChevronDoubleLeftIcon className="dblePrevBtn" />
          </button>
        ) : null}

        <button
          onClick={() => (playing ? pause() : play())}
          className="playBtn"
        >
          {playing ? (
            <PauseIcon className="pausIcn" />
          ) : (
            <PlayIcon className="playIcn" />
          )}
          <div className="divMusicBx" />
        </button>

        {songs.length > 1 ? (
          <button onClick={() => playNext()} className="nextBtn">
            <ChevronDoubleRightIcon className="dbleNextBtn" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MusicPlayer;
