import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  componentDidMount() {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', true);
    script.setAttribute('repo', '[ENTER REPO HERE]');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-light');
    anchor.appendChild(script);
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          {/* <script
            src="https://utteranc.es/client.js"
            repo="andersonsts/challenge1-chapter3-reactjs"
            issue-term="pathname"
            theme="github-dark"
            crossOrigin="anonymous"
            async
          /> */}

          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="inject-comments-for-uterances" />
        </body>
      </Html>
    );
  }
}
