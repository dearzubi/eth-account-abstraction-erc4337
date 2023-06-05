
#/bin/bash
export $(grep -v '^#' .env | xargs)
docker run --net=host --rm -ti sherifahmed990/voltaire-bundler:latest --entrypoint $ERC4337_BUNDLER_ENTRY_POINT --bundler_secret $ERC4337_BUNDLER_PRIVATE_KEY --rpc_url $ERC4337_BUNDLER_HOST --rpc_port $ERC4337_BUNDLER_PORT --ethereum_node_url $ERC4337_BUNDLER_ETH_CLIENT_URL --chain_id $ERC4337_BUNDLER_CHAIN_ID --verbose --debug