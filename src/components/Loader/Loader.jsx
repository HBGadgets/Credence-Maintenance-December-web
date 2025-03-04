import React from 'react'
import './Loader.css'
import loader from '../../assets/credenceLoader/Creadence_logo_png.png'

const Loader = () => {
  return (
    <div className='loaderScreen'>
      <div className="loaderContainer">
        <img className='loader' src={loader} alt="Loading..." />
        Loading...
      </div>
    </div>
  )
}

export default Loader
