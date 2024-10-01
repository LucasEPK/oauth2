"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import { useRouter, useSearchParams  } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter()
  const query = useSearchParams();
  const code = query.get('code')

  const [visualizedData, setVisualizedData] = useState(<p></p>);

  function handleClick() {
    router.push(
      "https://discord.com/oauth2/authorize?client_id=1289636085810593803&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fdiscord&scope=identify"
    )
  }

  async function getData() {
    try {
      const data = await fetch("http://localhost:8000/discord_data", {
        method: 'GET',
        headers: {
          'Authorization': sessionStorage.getItem("access_token") || ""
        }
      })
      const dataJson = await data.json()
      const username = dataJson['username']
      const avatar = dataJson['avatar']
      const id = dataJson['id']
      setVisualizedData(
        <div>
          <p>{username}</p>
          <Image 
          src={`https://cdn.discordapp.com/avatars/${id}/${avatar}`}
          width={128}
          height={128}
          alt="No user data"
          />
        </div>
      )
    } catch (error) {
      console.log("Error fetching: ", error);
      setVisualizedData(
        <div>
          <p>No user data</p>      
        </div>
      )
    }
  }

  async function getAccessToken(code: string) {
    try {
      const res = await fetch("http://localhost:8000/access-token?code=" + code);
      const data = await res.json();
      sessionStorage.setItem("access_token", data.access_token);
    } catch (error) {
      console.log("Error fetching: ", error);
    }
  }

  useEffect(() => {
    // Check if the code is in the URL and get the access token from the backend.
    
    if (code) {
      getAccessToken(String(code))
    }
  }, [code])

  return (
    <div className={styles.container}>
      <Button onClick={handleClick} variant="outlined">Login with Discord</Button>
      <Button onClick={getData} variant="outlined">get data</Button>
      {visualizedData}
    </div>
  );
}
