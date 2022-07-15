import { React, useState } from "react";
import { ethers, utils } from "ethers";
import axios from "axios";
import "./index.css";

export default function App() {

  const [addressBook, setAddressBook] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentBundle, setCurrentBundle] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [currentBundleName, setCurrentBundleName] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [allToggle, setAllToggle] = useState(true);
  const [favoriteToggle, setFavoriteToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [popupToggle, setPopupToggle] = useState(false);
  const [tokenBalances, setTokenBalances] = useState([]);

  const address = "0x636F33Aa381A7022dBb7206908B2B66C78960FA0";

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
    setFavorites((prevFavs) => {
      const newState = [...prevFavs]
      newState.push(fav)
      return newState
    })
  }

  function addFollowing(follow) {
    setFollowing((prevFols) => {
      const newState = [...prevFols]
      newState.push(follow)
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

  function openPopup() {
    setPopupToggle(true)
  }

  function closePopup() {
    setCurrentBundle([])
    setCurrentBundleName('')
    setPopupToggle(false)
  }

  function deleteFav(fav) {
    setFavorites((favorites) => favorites.filter(deleted => deleted != fav))
  }

  function deleteFollow(follow) {
    setFollowing((following) => following.filter(deleted => deleted != follow))
  }

  function addToCurrentBundle(wallet) {
    setCurrentBundle((prevBundle) => {
      const newState = [...prevBundle]
      newState.push(wallet)
      return newState
    })
  }

  function addBundle(name, wallets) {
    setBundles((prevBundles) => {
      const newState = [...prevBundles]
      newState.push({
        name: name,
        wallets: wallets
      })
      return newState
    })
    setCurrentBundle([])
    setCurrentBundleName('')
    setPopupToggle(false)
  }

  async function testEndpoint() {
    const response = await axios.get(`/minecraftspeedrun/eth/?address=${address}`)
    if(response.data == "error") {
      console.log('error yo')
    }
    else {
      const result = response.data.result
      getTokens(result)
    }
  }

  function getTokens(result) {
    result.forEach(tx => {
      if (tx.to.toLowerCase() == address.toLowerCase()) {
        // console.log(`${tx.tokenSymbol}: ${ethers.utils.formatUnits(tx.value, tx.tokenDecimal)}`)
        setTokenBalances((prevBalances) => {
          const newState = [...prevBalances]
          newState.push({
            token: tx.tokenSymbol,
            amount: ethers.utils.formatUnits(tx.value, tx.tokenDecimal)
          })
          return newState
        })
      }
    })
    console.log('got tokens')
  }

  function calcState() {
    setTokenBalances((prevBalances) => {
      const newState = [...prevBalances]
      newState.reduce((acc, val) => {
        let o = acc.filter(obj => {
          return obj.token==val.token;
        }).pop() || {token:val.token, amount:0}
        o.amount += val.tokenacc.push(o)
        return acc
      })
      return newState
    })
    console.log('calculated state')
  }

  function testState() {
    console.log(tokenBalances)
  }

  // async function findBalances(balances) {
  //   const nonZeroBalances = balances.tokenBalances.filter(token => {
  //     return token.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  //   })

  //   console.log(`token balances of ${address}`)
    
  //   for (let token of nonZeroBalances) {
  //     let balance = token['tokenBalance']

  //     const metadataParams = JSON.stringify({
  //       "jsonrpc": "2.0",
  //       "method": "alchemy_getTokenMetadata",
  //       "params": [
  //         `${token['contractAddress']}`
  //       ],
  //       "id": 42
  //     });
    
  //     const metadataConfig = {
  //        method: 'post',
  //        url: 'https://eth-mainnet.g.alchemy.com/v2/0Q8uQLMDB-VGKYbvChaow_zXWUQKmWwG',
  //        headers: {
  //          'Content-Type': 'application/json'
  //        },
  //        data : metadataParams
  //     };

  //     const responseDos = await axios(metadataConfig)

  //     balance = balance/Math.pow(10, responseDos.data.result.decimals)
  //     balance = balance.toFixed(2)

  //     console.log(`${responseDos.data.result.symbol}: ${balance}`)
  //   }
  // }



  return (
    <div className="bg-slate-800 min-h-screen min-w-screen">
      <div className="w-5/6 min-h-screen border-x-2 border-slate-400 mx-auto">
        <div className="flex flex-col justify-center mx-auto">
          <div className="mt-20 w-[100%] border-b-2 border-slate-400">
            <h1 className="text-slate-200 ml-12 lg:ml-36 text-3xl mb-1">Zapper Address Book Assignment</h1>
          </div>
          <div className="flex flex-row justify-between w-5/6 mx-auto mt-10">
            <h1 className="mb-5 text-slate-200 text-xl">My Bundles</h1>
            <button className="rounded-xl bg-slate-200 hover:bg-slate-400 h-8 px-3" onClick={openPopup}>Create Bundle</button>
          </div>
          <div className="rounded-xl border-2 border-slate-200 h-56 w-5/6 mx-auto overflow-x-auto" id="hide-scrollbar">
            {
              bundles.length > 0 && <div className="flex flex-row">
                {
                  bundles.map((bundle) => {
                    return <div className="m-3 p-1 bg-slate-400 border-2 b-slate-200 rounded-xl flex flex-col w-48 overflow-x-hidden" key={bundle.name}>
                      <h3 className="text-slate-200 mx-auto">{bundle.name}</h3>
                      <div className="w-[100%] border-b-2 border-slate-200"></div>
                      {
                        bundle.wallets.map((wallet) => {
                          return <h3 className="text-slate-200">{wallet}</h3>
                        })
                      }
                    </div>
                  })
                }
              </div>
            }
          </div>
          {
            popupToggle && <div className="fixed bg-[#00000050] w-[100%] h-[100vh] top-0 left-0">
              <div className="w-1/2 my-0 mx-auto mt-48 bg-slate-800 rounded-lg overflow-auto flex flex-col p-4">
                <div className="flex flex-row justify-between mb-8">
                  <h1 className="text-2xl text-slate-200">Create Bundle</h1>
                  <button className="bg-slate-200 hover:bg-slate-400 rounded-xl px-3" onClick={closePopup}>x</button>
                </div>
                <h3 className="text-xl text-slate-200">Bundle Name</h3>
                <input className="mt-2 mb-2 rounded-xl bg-slate-200 py-1 pl-3 w-72 focus:outline-0" type="text" value={currentBundleName} placeholder="Search Address" onChange={(e) => setCurrentBundleName(e.target.value)}/>
                <div className="my-4 border-t-2 border-slate-400"></div>
                <h3 className="text-xl text-slate-200 mb-2">Wallets to Include</h3>
                {
                  addressBook.map((addyOrENS) => {
                    return allToggle && <div className="flex flex-row justify-between mt-2" key={addyOrENS}>
                      <h1 className="text-slate-200">{addyOrENS}</h1>
                      <button className="rounded-xl px-3 bg-slate-200 hover:bg-slate-400" onClick={() => addToCurrentBundle(addyOrENS)}>include</button>
                    </div>
                  })
                }
                {
                  currentBundle.length > 0 && <div className="flex flex-col">
                    <div className="my-4 border-t-2 border-slate-400"></div>
                    <h3 className="text-xl text-slate-200 mb-4">Included Wallets</h3>
                    <div className="flex flex-row overflow-x-auto h-12" id="hide-scrollbar">
                      {
                        currentBundle.map((wallet) => {
                          return <h3 className="mr-4 text-slate-200" key={wallet}>{wallet}</h3>
                        })
                      }
                    </div>
                  </div>
                }
                <div className="flex flex-row mt-4">
                  <button className="w-20 mr-2 rounded-xl bg-slate-200 hover:bg-slate-400" onClick={closePopup}>Cancel</button>
                  <button className="w-20 rounded-xl bg-slate-200 hover:bg-slate-400" onClick={() => addBundle(currentBundleName, currentBundle)}>Save</button>
                </div>
              </div>
            </div>
          }
          <div className="flex flex-row w-5/6 lg:w-2/3 mx-auto mt-14 items-center justify-between">
            <div className="flex flex-row items-center">
              <input className={`w-72 ${searchError ? "bg-red-500" : "bg-slate-200"} focus:outline-0 mr-6 rounded-xl pl-2 py-2`} type="text" placeholder="Search Address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}/>
              <button className="w-24 bg-slate-200 h-8 px-3 rounded-xl hover:bg-slate-400" onClick={validateAddress}>Search</button>
            </div>
            <div className="flex flex-row items-center">
              <button className={`rounded-xl ${allToggle ? "bg-slate-400" : "bg-slate-200"} px-4 mr-3 hover:bg-slate-400`} onClick={toggleAll}>All</button>
              <button className={`rounded-xl ${favoriteToggle ? "bg-slate-400" : "bg-slate-200"} px-4 mr-3 hover:bg-slate-400`} onClick={toggleFavorites}>Favorites</button>
              <button className={`rounded-xl ${followingToggle ? "bg-slate-400" : "bg-slate-200"} px-4 hover:bg-slate-400`} onClick={toggleFollowing}>Following</button>
            </div>
          </div>
          <div className="w-5/6 lg:w-2/3 mx-auto mt-2">
            <span className={`${searchError ? "text-red-500" : "text-slate-800"} ml-2`}>not a valid wallet address</span>
          </div>
          <div className="flex flex-col justify-center w-2/3 mx-auto mt-5">
            <h1 className="text-2xl text-slate-200 mb-6">Wallets</h1>
            {
              addressBook.map((addyOrENS) => {
                return allToggle && <div className="flex flex-row justify-between mt-2" key={addyOrENS}>
                  <h1 className="text-lg text-slate-200">{addyOrENS}</h1>
                  <div className="flex flex-row">
                    <button className="w-20 rounded-xl bg-slate-200 mr-1 p-1 hover:bg-slate-400" onClick={() => addFavorite(addyOrENS)}>Favorite</button>
                    <button className="w-20 rounded-xl bg-slate-200 p-1 hover:bg-slate-400" onClick={() => addFollowing(addyOrENS)}>Follow</button>
                  </div>
                </div>
              })
            }
            {
              favorites.map((fav) => {
                return favoriteToggle && <div className="flex flex-row justify-between mt-2" key={fav}>
                  <h1 className="text-lg text-slate-200">{fav}</h1>
                  <button className="w-20 rounded-xl bg-slate-200 hover:bg-slate-400 p-1" onClick={() => deleteFav(fav)}>Delete</button>
                </div>
              })
            }
            {
              following.map((follow) => {
                return followingToggle && <div className="flex flex-row justify-between mt-2" key={follow}>
                  <h1 className="text-lg text-slate-200">{follow}</h1>
                  <button className="w-20 rounded-xl bg-slate-200 hover:bg-slate-400 p-1" onClick={() => deleteFollow(follow)}>Delete</button>
                </div>
              })
            }
          </div>
          <button className="w-48 mx-auto bg-slate-200 hover:bg-slate-400 p-1 rounded-xl mt-16" onClick={testEndpoint}>test getting tokens</button>
          <button className="w-48 mx-auto bg-slate-200 hover:bg-slate-400 p-1 rounded-xl mt-16" onClick={calcState}>calc state</button>
          <button className="w-48 mx-auto bg-slate-200 hover:bg-slate-400 p-1 rounded-xl mt-16" onClick={testState}>test state</button>
        </div>
      </div>
    </div>
  )
}