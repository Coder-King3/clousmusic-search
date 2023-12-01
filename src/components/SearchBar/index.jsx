import React, { useState } from 'react'
import ImageIcon from '@/base-ui/ImageIcon'
import { getSearchMusic } from '@/service/api/search'
import { getSongDetail } from '@/service/api/song'
import eventBus from '@/utils/CKEventBus'
import { getAssetsUrl, beautify } from '@/utils'
import './style.less'

function SearchBar() {
  const [searchForm, setSearchForm] = useState({
    keywords: '',
    loading: false
  })

  const musicSearch = async () => {
    if (
      searchForm.loading ||
      !searchForm.keywords ||
      searchForm.keywords.trim() == ''
    )
      return

    setSearchForm({ ...searchForm, loading: true })
    const searchMusicResult = await getSearchMusic({
      keywords: searchForm.keywords
    })
    const ids = searchMusicResult.result.songs.map(({ id }) => id).join(',')

    const songDetailResult = await getSongDetail({
      ids
    })
    const musicList = songDetailResult.songs.map((item) => ({
      id: item.id,
      name: item.name,
      src: item.al.picUrl,
      isAddPlayer: false,
      isPlayer: false,
      author: item.ar.map(({ name }) => name).join('/')
    }))

    eventBus.emit('update:MusicList', musicList)
    setSearchForm({ ...searchForm, loading: false })
  }

  return (
    <div className="search-bar mt-60 flex flex-col items-center  justify-center">
      <h1 className="search-bar_title relative flex items-center text-5xl font-bold text-gray-800 transition-colors dark:text-white dark:opacity-80">
        ClousMusic
        <span className="ml ml-3 rounded-xl bg-current p-2 text-[0.7em] leading-none">
          <span className="text-white dark:text-black">Search</span>
        </span>
      </h1>

      <div className="search-bar_box mt-7 flex">
        <input
          type="text"
          value={searchForm.keywords}
          onChange={(e) => {
            setSearchForm({ ...searchForm, keywords: e.target.value })
            if (!e.target.value || e.target.value.trim() == '') {
              eventBus.emit('update:MusicList', [])
              eventBus.emit('update:PlayerTracks', {}, true)
            }
          }}
          onKeyUp={(e) => e.keyCode === 13 && musicSearch()}
          className="h-9 w-64 rounded-md border-2 p-2 outline-0"
        />
        <button
          className="ml-2 h-9 rounded-md bg-black px-2"
          onClick={musicSearch}
        >
          {!searchForm.loading ? (
            <ImageIcon
              iconUrl={getAssetsUrl('search')}
              style={beautify`
                width: 1.5em;
                height: 1.5em;
              `}
            />
          ) : (
            <ImageIcon
              iconUrl={getAssetsUrl('loading')}
              className="loading-rotate"
              style={beautify`
                width: 1.5em;
                height: 1.5em;
              `}
            />
          )}
        </button>
      </div>
    </div>
  )
}

export default SearchBar
