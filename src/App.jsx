import React from 'react'
import SearchBar from './components/SearchBar'
import SongList from './components/SongList'
import SongPlayer from './components/SongPlayer'

function App() {
  return (
    <div className="sraech-container h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="jumbo absolute -inset-[10px] -z-10 opacity-50"></div>
      </div>
      <div className="relative">
        <SearchBar></SearchBar>
        <SongList></SongList>
        <SongPlayer></SongPlayer>
      </div>
    </div>
  )
}

export default App
