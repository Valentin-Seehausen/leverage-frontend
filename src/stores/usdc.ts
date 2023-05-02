import { getContract, getProvider, type Provider, type Signer } from '@wagmi/core';
import usdcAbi from './abis/USDC';
import { parseUnits } from 'ethers/lib/utils.js';
import { fetchSigner } from '@wagmi/core';

import { wallet } from './wallet';

let usdcAddress = '0xeE7661b284c0423ae99700a894C39Ce600c8d7CC';

export const increaseAllowance = async (amount: number) => {
	let signer = await fetchSigner();
	if (!signer) throw new Error('no signer');

	let usdc = getContract({
		address: usdcAddress,
		abi: usdcAbi,
		signerOrProvider: signer
	});
	console.log('increasing allowance', parseUnits(amount.toString(), 6));
	return usdc.increaseAllowance(
		'0x180d9fa830edb33170470b160C83005e68BA4864',
		parseUnits(amount.toString(), 6)
	);
	console.log('allowance increased');
};
