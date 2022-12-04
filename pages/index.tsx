import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState({ text: "" });
  const [name, setName] = useState();
  const [position, setPosition] = useState();
  const [reason, setReason] = useState();
  const [connection, setConnection] = useState();
  const [search, setSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        setIsLoading(true);
        console.log(search);
        const res = await fetch(`/api/openai`, {
          body: JSON.stringify({
            name: search,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const data = await res.json();
        setData(data);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Introduction Email Generator</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>Introduction Email Generator</a>
        </h1>
        <h2>
          <a>
            This tool will generate a personalized introduction email to use
            saving you time from writing it yourself.
          </a>
        </h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>What is the person's name?</h3>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <h3>What is the person's position?</h3>
            <input
              type="text"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
            <h3>
              What's the reason you are contacting this person? (please be
              specific)
            </h3>
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <h3>How do you know this person?</h3>
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <div>
              <button
                className="text-xs"
                type="button"
                onClick={() => setSearch(name)}
              >
                Generate
              </button>
            </div>
          </div>
          <h4>Email: </h4>
          {isLoading ? <div> Generating ...</div> : <span>{data.text}</span>}
        </div>
        <div>
          Created by Ahmed Ahres - feel free to reach out on{" "}
          <a
            className={styles.contact}
            href="https://twitter.com/Boudatw"
            href="_blank"
          >
            Twitter
          </a>{" "}
          or via{" "}
          <a className={styles.contact} href="mailto: ahmedahres98@gmail.com">
            {" "}
            e-mail!
          </a>
        </div>
      </main>
    </div>
  );
}
