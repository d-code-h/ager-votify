import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Logo from '../public/main-logo-preview.png';
import Ager from '../public/logo-preview.png';
import Brand from '../public/brand.png';
import Sponsor from '../public/sponsor.png';

export default function Home({ matric, setMatric }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const [access, setAccess] = useState(false);
  const handleEvent = () => {
    setActive(true);
  };
  const handleBlur = () => {
    matric === '' && setActive(false);
  };
  const handleChange = (e) => {
    setMatric(e.target.value);
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const resp = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matric }),
    });

    const data = await resp.json();
    if (resp.status === 200) {
      const y = data.matric.slice(0, 4);
      const s = data.matric.slice(5, 6);
      const c = data.matric.slice(7);

      if (data.post === 'Admin') {
        const p = 'Admin';
        return router.push(`/voter?y=${y}&s=${s}&c=${c}&p=Admin`);
      }
      return router.push(`/voter?y=${y}&s=${s}&c=${c}`);

      // Block all other users
      // return setError('Voting time exceeded! You are not allowed to vote');
    }
    setError(data.message);
  };
  return (
    <>
      <Head>
        <title>Ager 500 - Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/main-logo-preview.png" />
      </Head>
      <main className={styles.main}>
        <div className={styles.overlay}></div>
        <section className={styles.access}>
          <div className={styles.content}>
            <div className={styles.content_hero}>
              <Image
                className={styles.content_hero_img}
                src={Logo}
                width={160}
                height={150}
                alt="Ager"
              />
              <h1 className={styles.heading}> Login To Vote</h1>
            </div>
            <section className={styles.full__width}>
              <form
                action="/api/login"
                method="POST"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className={styles.input_group}>
                  <input
                    className={active ? styles.input_active : styles.input}
                    autoComplete="off"
                    name="matric"
                    type="text"
                    required=""
                    value={matric}
                    onChange={(e) => handleChange(e)}
                    onFocus={() => handleEvent()}
                    onBlur={() => handleBlur()}
                  />
                  <label className={active ? styles.label : styles.not_label}>
                    Matric Number
                  </label>
                  {error !== '' && <p className={styles.error}>{error}</p>}
                </div>
                <button
                  type="submit"
                  className={
                    `${styles.btn}` + ` ${access && styles.btn_access}`
                  }
                  onClick={() => setAccess(true)}
                >
                  {access ? 'Loading...' : 'Login'}
                </button>
              </form>

              <div className={styles.sponsored}>
                <h4>Sponsored By:</h4>
                <marquee behavior="" direction="">
                  <Image src={Ager} width={80} height={80} alt="Ager" />
                  <Image
                    className={styles.spons}
                    src={Brand}
                    width={80}
                    height={80}
                    alt="Ager"
                  />
                  <Image
                    className={styles.sponsor}
                    src={Sponsor}
                    width={100}
                    height={100}
                    alt="Ager"
                  />
                </marquee>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
