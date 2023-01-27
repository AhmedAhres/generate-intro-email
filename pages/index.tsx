import Head from "next/head";
import styles from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { AnalyticsBrowser } from '@segment/analytics-next'
import React from "react";
import { createGenie } from "usegenie";

export default function Home() {
  const [responseEmail, setResponseEmail] = useState("");
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [reason, setReason] = useState("");
  const [connection, setConnection] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyButton, setCopyButton] = useState(false);
  const { Configuration, OpenAIApi } = require("openai");
  const genie = createGenie({apiKey: ""});
  const analytics = AnalyticsBrowser.load({
  writeKey: typeof process.env.NEXT_PUBLIC_SEGMENT_API_KEY === 'string'
    ? process.env.NEXT_PUBLIC_SEGMENT_API_KEY
    : '',
  });

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    analytics.track('Copied email', {
      result: text
    });
  };

  const writeEmail = async () => {
    if (name && position && reason) {
      setCopyButton(false);
      setIsLoading(true);
      const response = await genie.generate("4f4958ab-a3cb-4234-8779-4c2b429e718e", {
        name: name,
        position: position,
        connection: connection,
        reason: reason
      });
      if (response) {
        let result =  (response as any).firstResult
          ?  (response as any).firstResult
              .split("\n")
              .map((line: any, index: any) => (
                <React.Fragment key={index}>
                  <br />
                  {line}
                </React.Fragment>
              ))
          : "Unable to generate, please check back later or reach out!";
        setResponseEmail( (response as any).firstResult);
        setResult(result);
        setIsLoading(false);
        setCopyButton(true);
        analytics.track('Generated email', {
          email:  (response as any).firstResult
        });
      } else {
        setResult("Too many requests, please try again in a few minutes.");
      }
      setIsLoading(false);
    } else {
      setCopyButton(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please make sure you have written a response to the first 3 questions.",
      });
    }
  };

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
            Introduce yourself like a pro with our free and easy-to-use email
            generator!
          </a>
        </h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>What is the person&apos;s name?</h3>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
            />
            <h3>What is their position?</h3>
            <input
              className={styles.input}
              type="text"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              placeholder="Professor at Stanford"
            />
            <h3>
              What&apos;s the reason you are contacting them? (please be
              specific)
            </h3>
            <input
              className={styles.input}
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="I want to work in their lab"
            />
            <h3>How did you hear about them?</h3>
            <input
              className={styles.input}
              type="text"
              value={connection}
              onChange={(event) => setConnection(event.target.value)}
              placeholder="I found their name in a research paper"
            />
            <div>
              <button type="button" onClick={() => writeEmail()}>
                Generate
              </button>
            </div>

            <h4>Email: </h4>
            {isLoading ? (
              <p className={styles.generate}>Generating ... </p>
            ) : (
              <p className={styles.result}>{result}</p>
            )}
            {copyButton ? (
              <button
                className={styles.button}
                onClick={() => {
                  copyToClipboard(responseEmail);
                }}
              >
                Copy email
              </button>
            ) : (
              <p></p>
            )}
          </div>
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
