import '../styles/globals.css'

import './prism.css'
// Reference: https://stackoverflow.com/questions/65628350/mdx-syntax-highlighting-is-not-working-in-next-js
// Additional Reference: https://www.youtube.com/watch?v=xw1SmTBIwtA

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
