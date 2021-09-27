import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import React, { SyntheticEvent, useState } from 'react';
import validUrl from 'valid-url';

export default function Home() {
  const [url, setUrl] = useState({
    longUrl: ``,
    shortUrl: ``,
    error: ``,
  });

  const setErrorState = (error: string) => {
    let errorMessage = error;

    if (error.includes(`Unexpected token <`)) {
      errorMessage = `Something went wrong, please try again`;
    }

    setUrl((prevState) => ({
      ...prevState,
      error: errorMessage,
    }));
  };

  const clearState = () => {
    setUrl((prevState) => ({
      longUrl: ``,
      shortUrl: ``,
      error: ``,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUrl((prevState) => ({
      ...prevState,
      [name]: value,
      error: ``,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearState();
    if (!url.longUrl || !validUrl.isUri(url.longUrl)) {
      return setErrorState(`Must be a fully qualified URL`);
    }

    const shortUrl = await fetch(`/api/shortenUrl`, {
      body: JSON.stringify({
        longUrl: url.longUrl,
      }),
      headers: {
        'Content-Type': `application/json`,
      },
      method: `POST`,
    })
      .then(async (res) => {
        const json = await res.json();
        const { shortUrl: newUrl } = json;

        setUrl((prevState) => ({
          ...prevState,
          shortUrl: newUrl,
        }));
      })
      .catch((error) => {
        setErrorState(error.message);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MicroLink</title>
        <meta name="MicroLink" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.gridTitle}>
          <div className={styles.cardTitle}>
            <h3 className={styles.title}>Shorten Up That URL</h3>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                className={styles.shortUrlInput}
                name="longUrl"
                onChange={handleChange}
                id="longUrl"
                value={url.longUrl}
                placeholder="https://somewebsite.com/some-long-path"
              />
              <button type="submit" className={styles.submitUrl}>
                Get Short
              </button>
            </form>
            {url.error ? (
              <>
                <div className={styles.error}>Error: {url.error}</div>
                {` `}
              </>
            ) : null}
          </div>
        </div>

        {url.shortUrl ? (
          <div className={styles.gridResult}>
            <div className={styles.cardShortUrl}>
              <div>Got that all shortened up for you:</div>
              <a target="_blank" href={url.shortUrl} rel="noreferrer">
                {url.shortUrl}
              </a>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
