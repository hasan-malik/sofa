import { useState } from 'react'
import './App.css'
import LandingPage from "./pages/LandingPage"
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'

import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";


export default function App() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("posts")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    test();
  }, []);

  // return <SignupPage/>
  return <FeedPage/>
}
