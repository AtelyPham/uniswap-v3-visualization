import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'state';
import { client } from './apollo';
import App from './App';
import './index.css';
import PoolUpdater from 'state/pools/updater';
import TokenUpdater from 'state/tokens/updater';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const Updater = () => (
  <>
    <PoolUpdater />
    <TokenUpdater />
  </>
);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Updater />
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
);
