import AppRouter from "./router/AppRouter";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "./components/ui/provider";

import { store } from "./app/store";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apollo/apolloClient";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider forcedTheme="dark">
        <ReduxProvider store={store}>
          <Toaster />
          <AppRouter />
        </ReduxProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default App;
