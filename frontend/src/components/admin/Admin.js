// src/components/admin/Admin.js
import React, {useState , useEffect} from 'react';
import SideBar from './sidebar/SideBar';
import Header from './header/Header';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useJwt } from 'react-jwt';


const Admin = ({ username }) => {
  const [user , setUser] = useState('')
  const token = localStorage.getItem('token')
  const { decodedToken, isExpired } = useJwt(token);

  useEffect(() => {
    if (decodedToken) {
      axios.get(`http://localhost:8080/users/user/${decodedToken.sub}`)
      .then((response) => {
        setUser(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }, [decodedToken]);  

  return (
    <div>
      <SideBar />
      <div className='main-container'>
        <Header username={user} />
        <div className='main-div'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
