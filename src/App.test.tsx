import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders learn react link', async () => {
  render(
    <MockedProvider>
      <App />
    </MockedProvider>,
  );
  const linkElement = screen.getByText(/world/i);
  expect(linkElement).toBeInTheDocument();
});
