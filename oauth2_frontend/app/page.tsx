"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Home() {
  const router = useRouter()

  const [visualizedData, setVisualizedData] = useState(<p></p>);

  function handleClick() {
    router.push(
      "https://discord.com/oauth2/authorize?client_id=1289636085810593803&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fdiscord&scope=identify"
    )
  }

  async function getData() {
    const data = await fetch("http://localhost:8000/discord_data")
    const dataJson = await data.json()
    const username = await dataJson['username']
    const avatar = await dataJson['avatar']
    const id = await dataJson['id']
    await setVisualizedData(
      <div>
        <p>{username}</p>
        <Image 
        src={`https://cdn.discordapp.com/avatars/${id}/${avatar}`}
        width={128}
        height={128}
        alt="discord avatar"
        />
      </div>
    )
  }

  return (
    <div >
      <Button onClick={handleClick} variant="outlined">Login with Discordo</Button>
      <Button onClick={getData} variant="outlined">get data</Button>
      {visualizedData}
    </div>
  );
}
