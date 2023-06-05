A private single node Go-Ethereum network for testing purposes.

# Getting started

1. Install Go-Ethereum from [here](https://geth.ethereum.org/docs/getting-started/installing-geth/).
    > Don't need to install Consensus Client e.g. Ligthouse for private networks.
2. Run the following command to initialize the network:

    ```bash
    geth init --datadir data genesis.json
    ```
3. Run the following command to start the node.

    ```bash
    geth --datadir geth/data --allow-insecure-unlock --unlock 0xABc9ad659aCa9Ed794360De266D4ACd9898a6FD0,0x98BFC7C0BcC6C0a24Cd020144753397F1A56037c --mine --miner.etherbase=0xABc9ad659aCa9Ed794360De266D4ACd9898a6FD0 --password geth/data/keystore/password.txt --http --http.port 8545 --http.api eth,net,web3,debug,personal --http.corsdomain '*'
      
    ```

### Recover private key from keystore

1. Run the following command to get the private key from keystore.

    ```bash
    node keyrecover.js <address> <password>
    ```