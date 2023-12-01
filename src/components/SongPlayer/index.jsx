import React, { useState, useEffect, createRef } from 'react'
import Player from '@madzadev/audio-player'
import '@madzadev/audio-player/dist/index.css'
import ImageIcon from '@/base-ui/ImageIcon'
import SoundEffects from './cpns/SoundEffects'
import eventBus from '@/utils/CKEventBus'
import { getAssetsUrl, beautify, downloadFile } from '@/utils'
import './style.less'

function SongPlayer() {
  const [songPlayer, setSongPlayer] = useState({
    showSonglist: false,
    playerTracks: [],
    currKey: null
  })
  const coverRef = createRef()
  const colors = `html {
    --tagsBackground: #5c7cfa;
    --tagsText: #ffffff;
    --tagsBackgroundHoverActive: #2cc0a0;
    --tagsTextHoverActive: #ffffff;
    --searchBackground: rgba(0,0,0,0.5);
    --searchText: #ffffff;
    --searchPlaceHolder: #575a77;
    --playerBackground: rgba(0,0,0,0.5);
    --titleColor: #ffffff;
    --timeColor: #ffffff;
    --progressSlider: #5c7cfa;
    --progressUsed: #5c7cfa;
    --progressLeft: rgba(0,0,0,0.5);
    --volumeSlider: #5c7cfa;
    --volumeUsed: #ffffff;
    --volumeLeft:  rgba(0,0,0,0.5);
    --playlistBackground: rgba(0,0,0,0.5);
    --playlistText: #ced4da;
    --playlistBackgroundHoverActive:  rgba(0,0,0,0.5);
    --playlistTextHoverActive: #ffffff;
  }`
  // #18191f #151616

  eventBus.on('update:PlayerTracks', (tracks, isClear = false) => {
    const list = isClear ? [] : [...songPlayer.playerTracks, tracks]

    setSongPlayer({
      ...songPlayer,
      playerTracks: list,
      currKey: isClear ? null : tracks.title
    })
  })

  const handleShowSonglist = () => {
    setSongPlayer({
      ...songPlayer,
      showSonglist: !songPlayer.showSonglist
    })
  }

  const musicDownload = () => {
    const currentEl = document
      ?.querySelector('._RZMQZ')
      ?.querySelector('._2ybYQ')

    const currentItem = songPlayer.playerTracks.find(
      (item) => item.title == currentEl.innerText
    )

    if (!currentItem) return

    console.log(`currentItem:`, currentItem)

    downloadFile(currentItem.url, currentItem.title)
  }

  useEffect(() => {
    const musicList = document?.querySelector('._RZMQZ')?.querySelectorAll('p')

    musicList?.forEach((item) => {
      item.addEventListener('click', (event) => {
        const currentKey = event.target.innerText || null
        const currentItem = songPlayer.playerTracks.find(
          (item) => item.title == currentKey
        )
        if (currentKey && currentItem) coverRef.current.src = currentItem?.src
      })
    })
  })

  return (
    <>
      {Array.isArray(songPlayer.playerTracks) &&
        songPlayer.playerTracks.length > 0 && (
          <div className="song-player">
            <div
              className={`song-player_bar ${
                songPlayer.showSonglist ? 'show-song-list' : ''
              }`}
            >
              <Player
                className="song-player_box"
                trackList={songPlayer.playerTracks}
                customColorScheme={colors}
                includeTags={false}
                includeSearch={false}
                showPlaylist={true}
                autoPlayNextTrack={false}
              />
              <div className="song-player_cover">
                <SoundEffects
                  ref={coverRef}
                  className="cover-img"
                  url={getAssetsUrl('logo', 'png', 'images')}
                ></SoundEffects>
                <div
                  className="cover-download absolute left-0 top-0 flex items-center justify-center overflow-hidden rounded-full bg-black/50"
                  style={beautify`
                    width: 100%;
                    height: 100%;
                    transition: all 0.5s ease-in-out;
                  `}
                  onClick={musicDownload}
                >
                  <ImageIcon
                    iconUrl={getAssetsUrl('download')}
                    style={beautify`
                      width: 60%;
                      height: 60%;
                    `}
                  />
                </div>
              </div>

              <div className="song-player_list" onClick={handleShowSonglist}>
                <ImageIcon
                  iconUrl={getAssetsUrl('play-list')}
                  style={beautify`
                    width: 28px;
                    height: 28px;
                  `}
                />
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default SongPlayer
