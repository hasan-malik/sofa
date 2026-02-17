import { useState } from 'react'
import './App.css'
import LandingPage from "./pages/LoginPage"
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'

import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import LoginPage from './pages/LoginPage'


export default function App() {
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
    }

    test();
    getUserFromAuth();
  }, []);

  return <LoginPage/>
  // return <SignupPage/>
  // return <FeedPage/>
}
