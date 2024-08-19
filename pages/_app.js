import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Navigation from "@/components/Navigation";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/86819/nft-marketplace/version/latest",
});
import { NotificationProvider } from "web3uikit";
export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>
          <Navigation />
          <Component {...pageProps} />
        </NotificationProvider>
      </ApolloProvider>
    </MoralisProvider>
  );
}
