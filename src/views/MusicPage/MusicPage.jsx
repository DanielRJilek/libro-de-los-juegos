const API_URL = import.meta.env.VITE_API_URL;
import { useContext, useState, useEffect, use } from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import 'react-toastify/dist/ReactToastify.css';
import "./MusicPage.css";

function MusicPage() {
    return (
        <div className="music-page">
            <div className="music-header">
                <h1 className="games-title">About the Music</h1>
            </div>
            <div className="music-content"></div>
            
        </div>
    )
}

export default MusicPage