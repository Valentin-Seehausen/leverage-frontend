import { parseUnits } from 'viem';

export const dev = new URLSearchParams(window.location.search).has('dev');

export const liquidityPoolDecimals = 18;
export const usdcDecimals = 6;
export const priceFeedDecimals = 8;
export const leverageDecimals = 6;
export const percentageDecimals = 18;
export const minCollateral = parseUnits('100', usdcDecimals);

export const graphEndpointMumbai =
	'https://api.studio.thegraph.com/query/46177/mumbai-p2p-leverage/v0.0.10';
export const graphEndpointArbitrumGoerli =
	'https://api.studio.thegraph.com/query/46177/hyperbolic-finance/v0.2.0';
export const graphEndpointArbitrumGoerliDev =
	'https://api.studio.thegraph.com/query/46177/hyperbolic-finance-dev/v0.2.0';

export const arbitrumGoerliChainId = 421613;
