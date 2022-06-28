# 👨🏼‍💻 Visualize the [Uniswap](https://uniswap.org/) data using [The Graph Protocol](https://thegraph.com/en/).

Visualizes data from [Uniswap V3 Subgraph](https://github.com/Uniswap/v3-subgraph).

## Project structure

- `apollo`: Apollo client setup and graphql queries.

- `components`: React components.

- `constants`: Project constants.

- `hooks`: React hooks.

- `state`: The app state.

- `types`: Generate and defined `Typescript` type file.

- `utils`: Commonly-used utilities.

## Version

- Node `v14.17.6`.
- Yarn `1.22.15`

## How to start locally

Clone the repo:

```shell
git clone https://github.com/AtelyPham/webb-full-stack-coding-challenge.git
```

or

```shell
git clone git@github.com:AtelyPham/webb-full-stack-coding-challenge.git
```

\
Go to the cloned directory

```shell
cd webb-full-stack-coding-challenge
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

- [x] Add network summary session

- [ ] Writing tests
