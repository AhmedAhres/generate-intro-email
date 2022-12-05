import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [reason, setReason] = useState("");
  const [connection, setConnection] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        setIsLoading(true);
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: search,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        if (response.status == "200") {
          let result = response.data.choices[0].text
            ? response.data.choices[0].text
            : "Unable to generate, please make sure you have written sufficient information.";
          setResult(result);
          setIsLoading(false);
        } else {
          setResult("Cannot generate email, please try again later.");
        }
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
            <h3>What is the person&apos;s name?</h3>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
            />
            <h3>What is the person&apos;s position?</h3>
            <input
              type="text"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              placeholder="Professor at Stanford"
            />
            <h3>
              What&apos;s the reason you are contacting this person? (please be
              specific)
            </h3>
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="I want to work in their lab"
            />
            <h3>How did you hear about this person?</h3>
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="I found their name in a research paper"
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
          {isLoading ? <p> &nbsp; Generating ...</p> : <span>{result}</span>}
        </div>
        <div>
          Created by Ahmed Ahres - feel free to reach out on{" "}
          <a
            className={styles.contact}
            href="https://twitter.com/Boudatw"
            target="_blank"
            rel="noreferrer"
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
