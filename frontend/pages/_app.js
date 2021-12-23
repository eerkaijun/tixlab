import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import { wrapper } from "../store/configureStore";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <Component {...pageProps} />;
    </div>
  );
}

export default wrapper.withRedux(MyApp);
