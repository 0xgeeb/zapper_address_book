import { React, useState } from "react";
import { ethers, utils } from "ethers";
import "./index.css";

export default function App() {

  const [addressBook, setAddressBook] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchError, setSearchError] = useState(false);

  function validateAddress() {
    setSearchError(false)
    try {
      utils.getAddress(searchAddress)
      console.log(searchAddress)
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


  return (
    <div className="flex flex-col justify-center mt-36">
      <h1 className="text-red-500 mx-auto">address book</h1>
      <input className={`w-72 ${searchError ? "bg-red-500" : "bg-slate-200"} mx-auto mt-12 rounded pl-2 py-2`} type="text" placeholder="Search Address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)}/>
      <button className={`w-24 ${searchError ? "bg-red-500" : "bg-slate-200"} mx-auto mt-4 rounded hover:bg-slate-600`} onClick={validateAddress}>search</button>
      <span className={`${searchError ? "text-red-500" : "text-white"} mt-2 mx-auto`}>not a valid wallet address</span>
      <div className="w-5/6">
        {
          addressBook.map((x) => {
            return x
          })
        }
      </div>
    </div>
  )
}