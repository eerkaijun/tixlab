import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";

import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import { wrapper } from "../store/configureStore";

const MyApp = ({ Component, pageProps, store }) => {
  return (
    <div>
      <Navbar />
      {/* <Provider store={store}> */}
      <Component {...pageProps} />
      {/* </Provider> */}
    </div>
  );
};
// MyApp.getInitialProps = async ({ Component, ctx }) => {
//   const pageProps = Component.getInitialProps
//     ? await Component.getInitialProps(ctx)
//     : {};
//   return { pageProps };
// };

// export default withRedux(store)(MyApp);
export default wrapper.withRedux(MyApp);
// export default MyApp;
