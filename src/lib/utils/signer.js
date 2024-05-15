import { arbitrumSepoliaChainId } from '$lib/config/constants';
import { config } from '$lib/stores/client';
import { getWalletClient, switchChain } from '@wagmi/core';
import { toast } from '@zerodevx/svelte-toast';

export const fetchSignerOrWarn = async () => {
	let signer = await getWalletClient(config);
	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const signerChainId = await signer.getChainId();

	if (signerChainId != arbitrumSepoliaChainId) {
		const newNetwork = await switchChain(config, { chainId: arbitrumSepoliaChainId });
		if (newNetwork.id != arbitrumSepoliaChainId) {
			toast.push('Please switch to Arbitrum Sepolia Testnet', {
				duration: 2000,
				classes: ['error']
			});
			return;
		}
		signer = await getWalletClient(config);
	}

	return signer;
};
