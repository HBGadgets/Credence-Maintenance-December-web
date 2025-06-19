import React from 'react'
import loader from '../../assets/brand/loader.gif'
import './loaderbus.css'

const Loader = () => {
  return (
    <div className="loaderScreen">
      <div className="loaderContainer">
        <img className="loader" src={loader} alt="Loading..." />
        Loading...
      </div>
    </div>
  )
}

export default Loader
