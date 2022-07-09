import { React, useState } from "react"
import "./index.css"

export default function App() {

  const [address, setAddress] = useState([]);


  return (
    <div className="flex flex-col justify-center mt-36">
      <h1 className="text-red-500 mx-auto">address book</h1>
      <input className="w-48 bg-slate-200 mx-auto mt-12 rounded" type="text" />
    </div>
  )
}