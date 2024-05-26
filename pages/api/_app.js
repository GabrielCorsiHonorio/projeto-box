// pages/_app.js
import '/public/css/styles.css';

function stylerouter({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default stylerouter;
