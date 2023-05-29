"use client";

import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from 'react';
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const query = api.data.get.useQuery();
  useEffect(() => {
    const interval = setInterval(() => {
      void query.refetch()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const data = query.data || {};
  const table = <table>
    <thead>
      <tr>
        <th>id</th>
        <th>name</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(data).map(datum => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const [key, value] = datum as [string, string]
        return <tr key={key}>
          <td><b>{key}</b></td>
          <td>{value}</td>
        </tr>
      })}
    </tbody>
  </table>

  return (
    <>
      <Head>
        <title>תשקיף הגייט</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            תשקיף <span className={styles.pinkSpan}>הגייט</span>
          </h1>
          {Object.entries(data).map(datum => 
            )}
          <p className={styles.showcaseText}>
            {query.isFetched && table}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
