# 👨🏼‍💻 Webb Full Stack Coding Challenge

Visualizes data from [Uniswap V3 Subgraph](https://github.com/Uniswap/v3-subgraph).

## Version

- Node `v14.17.6`.
- Yarn `1.22.15`

## How to start locally

Clone the repo:

```shell
git clone
```

\
Install dependencies:

```shell
yarn
```

or

```shell
yarn install
```

\
Generate Typescript code from GraphQL

```SHELL
yarn generate
```

\
Serve the frontend locally

```SHEEL
yarn start
```

\
Other scripts:

- `yarn lint`: Linting checking
- `yarn prettier`: Prettier checking

## Technologies used

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Tailwindcss](https://tailwindcss.com/)

## Todos

- [x] Inspect what data / queries will be required using hosted [V3 subgraph explorer](https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3).

- [x] Setup data model, queries, and fetch data from Uniswap V3 Subgraph

- [x] Add a tabular visualization for “Top Pools” that displays total volume locked (TVL), and 24Hr volume

- [x] Add a tabular visualization for “Tokens” that displays price point, price change, and TVL

- [x] Add a tabular visualization for “Transactions” that displays total value, token amounts, linked account to Etherscan, and time (e.g. 15 mins ago)

- [x] Add a button which the user can click to refresh data in the views

- [x] Update readme to outline how to serve the frontend locally

- [x] Include in-line documentation

- [ ] Add summary and chart

- [ ] Writing tests
