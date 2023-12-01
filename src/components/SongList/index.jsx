import React, { useState, useEffect } from 'react'
import { getSongUrl } from '@/service/api/song'
import ImageIcon from '@/base-ui/ImageIcon'
import eventBus from '@/utils/CKEventBus'
import { getAssetsUrl, beautify } from '@/utils'
import './style.less'

function SongList() {
  const [song, setSong] = useState({
    musics: [],
    loading: false,
    current: null
  })

  const playMusic = async (music, indexKey) => {
    if (song.loading) return

    if (!music.isAddPlayer) {
      setSong({ ...song, loading: true, current: indexKey })
      const songUrlResult = await getSongUrl({ id: music.id })
      const songUrl = songUrlResult.data[0].url

      eventBus.emit(
        'update:PlayerTracks',
        {
          title: music.name,
          url: songUrl,
          src: music.src,
          tags: ['music']
        },
        false
      )

      const musics = song.musics.map((item) => item)
      musics[indexKey].isAddPlayer = true

      let currKey = music.name
      if (currKey) {
        let selectMusicItemID = setInterval(() => {
          const musicList = document
            ?.querySelector('._RZMQZ')
            ?.querySelectorAll('p')

          if (!musicList) return

          let currentEl
          musicList?.forEach((e) => {
            if (e.innerText == currKey) currentEl = e
          })

          if (!currentEl) return

          console.log(`musicList:`, musicList)
          console.log(`currentEl:`, currentEl)

          currentEl.click()

          currKey = null
          clearInterval(selectMusicItemID)
        }, 100)
      }

      setSong({
        ...song,
        musics,
        loading: false,
        current: null
      })
    }
  }

  eventBus.on('update:MusicList', (musicList) => {
    setSong({ ...song, musics: musicList.map((item) => item) })
  })

  return (
    <div
      className="song-list flex flex-wrap justify-around"
      style={beautify`max-width:1200px;`}
    >
      {song.musics.map((item, index) => (
        <li
          key={item.id}
          className="song-list_item mb-7 flex h-24 w-72 justify-between overflow-hidden rounded-3xl bg-black/30 text-white shadow-md backdrop-blur-sm"
        >
          <img src={item.src} className="cover h-24 w-24" />
          <div className="details w-full p-2">
            <b
              className="text-lg"
              style={beautify`
                overflow : hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;`}
            >
              {item.name}
            </b>
            <p className="mt-1 text-sm">{item.author}</p>
          </div>
          <div
            className="player absolute right-0 flex h-24 w-24 items-center justify-center bg-black ring-0"
            onClick={() => playMusic(item, index)}
          >
            {song.loading && index == song.current ? (
              <ImageIcon
                iconUrl={getAssetsUrl('loading')}
                className="loading-rotate"
                style={beautify`
                  width: 5em;
                  height: 5em;
                `}
              />
            ) : (
              <ImageIcon
                iconUrl={getAssetsUrl('play')}
                style={beautify`
                  width: 5em;
                  height: 5em;
                `}
              />
            )}
          </div>
        </li>
      ))}
      <i className="w-72"></i>
      <i className="w-72"></i>
    </div>
  )
}

export default SongList
