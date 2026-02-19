import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/LoginPage"
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'

import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import LoginPage from './pages/LoginPage'
import LoadingPage from './pages/LoadingPage'


export default function App() {
  const [user, setUser] = useState(null);
  const [finishedProcessingAuth, setFinishedProcessingAuth] = useState(false);
  // finishedProcessingAuth is important to prevent the "flash of incorrect UI"
  // if an already logged-in user opens the website, they momentarily see
  // the loginpage before seeing the feedpage

  async function onLogout() {
    const {data, error} = await supabase.auth.signOut();
    if (error) {
      console.log("Logout error", error)
    }

    setUser(null)
  }

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("posts")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    async function getUserFromAuth() {
      const {data, error} = await supabase.auth.getUser();
      console.log("User", data.user)
      console.log("Error", error)
      setUser(data.user)
      setFinishedProcessingAuth(true);
    }

    test();
    getUserFromAuth();
  }, []);

  if (!finishedProcessingAuth) {
    return <LoadingPage/>
  }

  // if (!user) {
  //   return <LoginPage/>
  // }
  // return user ? <FeedPage onLogout={onLogout}/> : <LoginPage/>
  // return <SignupPage/>
  // return <FeedPage/>
  return (
    <Routes>
      <Route path="/" element={user ? <FeedPage onLogout={onLogout}/> : <LoginPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      {/* <Route path="/loading" element={<LoadingPage/>}/> */}
    </Routes>
  )

}
