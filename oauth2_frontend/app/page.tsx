"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Button from '@mui/material/Button';

export default function Home() {
  async function handleClick() {
    const bruh = await fetch("http://localhost:8000")
    const bruhText = await bruh.text()
    console.log(bruhText)
  }
  return (
    <div >
      <Button onClick={handleClick} variant="outlined">Login with Discordo</Button>
    </div>
  );
}
