import React from "react";

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight:"400",
  subsets: ['latin']
})

export default function Home() {
  return (
    <main className={roboto.className}>
      <div>Hello world 1<span className="material-symbols-outlined">search</span></div>
    </main>
  );
}
