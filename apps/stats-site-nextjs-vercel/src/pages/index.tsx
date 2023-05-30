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
          <div className={styles.cardContainer}>
            {Object.entries(data).map(([key, value]) =>
              <div className={styles.cardRow} key={key}>
                <Link
                  className={styles.card}
                  href="#"
                >
                  <h3 className={styles.cardTitle}>{key}</h3>
                  <div className={styles.cardText}>
                    →→→ {value as any}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
