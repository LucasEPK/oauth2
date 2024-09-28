"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  function handleClick() {
    router.push(
      "https://discord.com/oauth2/authorize?client_id=1289636085810593803&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fdiscord&scope=identify"
    )
  }
  return (
    <div >
      <Button onClick={handleClick} variant="outlined">Login with Discordo</Button>
    </div>
  );
}
