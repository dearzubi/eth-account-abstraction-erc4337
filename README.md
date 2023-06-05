# ETH ERC-4337 Account Abstraction

Building supporting ecosystem and libraries for ERC4337.

Work in progress...

## Getting started

### Prerequisites

1. Docker to run the bundler.
2. Geth to start a private geth node.

### Setup

1. Run `npm install` to install the dependencies.
2. Run `npm run build` to build the project.
3. Run `npm run node` to start a private geth node.
4. Run `npm run deploy` to deploy the contracts to the private geth node.
5. Copy the entry point address from `dist/src/config/config.json` and update it in `bundler/.env` file.
6. Run `npm run bundler` to start a bundler instance.
7. Run `dist/src/test/register_simple_account.js` to register a simple account.

Errors and exceptions are highly expected at this point.

A lot of work to be done here. This is just starting. Collaborations are welcome. :)