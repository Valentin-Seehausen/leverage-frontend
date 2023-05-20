import { parseEther, parseUnits } from 'viem';

export const dev = new URLSearchParams(window.location.search).has('dev');

export const liquidityPoolDecimals = 18;
export const liquidityPoolMultiplier = 10n ** BigInt(liquidityPoolDecimals);
export const usdcDecimals = 6;
export const usdcMultiplier = 10n ** BigInt(usdcDecimals);
export const priceFeedDecimals = 8;
export const leverageDecimals = 6;
export const percentageDecimals = 18;
export const liquidityToUsdcMultiplier = 10n ** BigInt(liquidityPoolDecimals - usdcDecimals);
export const minCollateral = parseUnits('100', usdcDecimals);
export const devAddress = '0xfd08B2027F61893Ee2090E76eF157bdC56eF3e40';

export const graphEndpointMumbai =
	'https://api.studio.thegraph.com/query/46177/mumbai-p2p-leverage/v0.0.10';
export const graphEndpointArbitrumGoerli =
	'https://api.studio.thegraph.com/query/46177/hyperbolic-finance/v0.3.1';
export const graphEndpointArbitrumGoerliDev =
	'https://api.studio.thegraph.com/query/46177/hyperbolic-finance-dev/v0.3.1';

export const arbitrumGoerliChainId = 421613;
export const minBalance = parseEther('0.0009');
