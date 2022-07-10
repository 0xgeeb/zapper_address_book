import { React, useState } from "react";
import { ethers, utils } from "ethers";
import "./index.css";

export default function App() {

  const [addressBook, setAddressBook] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [allToggle, setAllToggle] = useState(true);
  const [favoriteToggle, setFavoriteToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);

  async function validateAddress() {
    setSearchError(false)
    try {
      if (searchAddress.slice(-4) === ".eth") {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const addy = await provider.resolveName(searchAddress)
        utils.getAddress(addy)
      }
      else {
        utils.getAddress(searchAddress)
      }
      setAddressBook((prevAB) => {
        const newState = [...prevAB]
        newState.push(searchAddress)
        return newState
      })
      setSearchAddress('')
    } catch (e) {
      console.log(`mf error ${e}`)
      setSearchError(true)
    }
  }

  function addFavorite(fav) {
    console.log('favorite', fav)
    setFavorites((prevFavs) => {
      const newState = [...prevFavs]
      newState.push(fav)
      return newState
    })
  }

  function addFollowing(fol) {
    console.log('following', fol)
    setFollowing((prevFols) => {
      const newState = [...prevFols]
      newState.push(fol)
      return newState
    })
  }

  function toggleAll() {
    setAllToggle(true)
    setFavoriteToggle(false)
    setFollowingToggle(false)
  }

  function toggleFavorites() {
    setAllToggle(false)
    setFavoriteToggle(true)
    setFollowingToggle(false)
  }

  function toggleFollowing() {
    setAllToggle(false)
    setFavoriteToggle(false)
    setFollowingToggle(true)
  }


  return (
    <div className="flex flex-col justify-center mt-36">
      <h1 className="text-red-500 mx-auto">address book</h1>
      <input className={`w-72 ${searchError ? "bg-red-500" : "bg-slate-200"} mx-auto mt-12 rounded pl-2 py-2`} type="text" placeholder="Search Address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}/>
      <button className={`w-24 ${searchError ? "bg-red-500" : "bg-slate-200"} mx-auto mt-4 rounded hover:bg-slate-600`} onClick={validateAddress}>search</button>
      <span className={`${searchError ? "text-red-500" : "text-white"} mt-2 mx-auto`}>not a valid wallet address</span>
      <div className="flex flex-row justify-center mx-auto mb-4">
        <button className="rounded bg-slate-200 p-1 mr-1 hover:bg-slate-600" onClick={toggleAll}>All</button>
        <button className="rounded bg-slate-200 p-1 mr-1 hover:bg-slate-600" onClick={toggleFavorites}>Favorites</button>
        <button className="rounded bg-slate-200 p-1 hover:bg-slate-600" onClick={toggleFollowing}>Following</button>
      </div>
      <div className="flex flex-col justify-center w-2/3 mx-auto">
        {
          addressBook.map((addyOrENS) => {
            return allToggle && <div className="flex flex-row justify-between mt-2" key={addyOrENS}>
              <h1>{addyOrENS}</h1>
              <div className="flex flex-row">
                <button className="rounded bg-slate-200 mr-1 p-1 hover:bg-slate-600" onClick={() => addFavorite(addyOrENS)}>hello</button>
                <button className="rounded bg-slate-200 p-1 hover:bg-slate-600" onClick={() => addFollowing(addyOrENS)}>goodbye</button>
              </div>
            </div>
          })
        }
        {
          favorites.map((fav) => {
            return favoriteToggle && <div className="mt-2" key={fav}>
              <h1>{fav}</h1>
            </div>
          })
        }
        {
          following.map((follow) => {
            return followingToggle && <div className="mt-2" key={follow}>
              <h1>{follow}</h1>
            </div>
          })
        }
      </div>
    </div>
  )
}