import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'state';
import NetworkUpdater from 'state/network/updater';
import PoolUpdater from 'state/pools/updater';
import TokenUpdater from 'state/tokens/updater';
import TransactionUpdater from 'state/transactions/updater';
import { client } from './apollo';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const Updater = () => (
  <>
    <NetworkUpdater />
    <PoolUpdater />
    <TokenUpdater />
    <TransactionUpdater />
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
