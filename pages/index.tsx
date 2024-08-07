import Head from "next/head";
import styles from "../styles/Home.module.css";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import React from "react";

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

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const writeEmail = async () => {
    if (name && position && reason) {
      setCopyButton(false);
      setIsLoading(true);
      const messages = [
        {
          role: "system",
          content: "You are an assistant that generates professional emails. Simply output the email text, nothing else.",
        },
        {
          role: "user",
          content: `Generate a confident and professional email to ${name} who is a ${position} that I came to know because ${connection}. Goal: ${reason}.`,
        },
      ];
      const response = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      if (response.status == "200") {
        let result = response.data.choices
          ? response.data.choices[0].message.content
              .split("\n")
              .map((line: any, index: any) => (
                <React.Fragment key={index}>
                  <br />
                  {line}
                </React.Fragment>
              ))
          : "Unable to generate, please check back later or reach out!";
        setResponseEmail(response.data.choices[0].message.content);
        setResult(result);
        setIsLoading(false);
        setCopyButton(true);
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
