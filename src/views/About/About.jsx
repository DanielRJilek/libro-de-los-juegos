import Header from '../../components/Header/Header';
import { useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";

function About() {
    return (
    <div className="page" id='main-menu-page'>
      <Header></Header>
      <div id='main'>
        <span className='games-title'>About</span>
      </div>  
    </div>
    )
}

export default About;