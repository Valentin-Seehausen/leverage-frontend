import { arbitrumGoerliChainId } from '$lib/config/constants';
import { getWalletClient, switchNetwork } from '@wagmi/core';
import { toast } from '@zerodevx/svelte-toast';

export const fetchSignerOrWarn = async () => {
	let signer = await getWalletClient();
	if (!signer) {
		toast.push('Please connect MetaMask', {
			duration: 2000,
			classes: ['error']
		});
		return;
	}

	const signerChainId = await signer.getChainId();

	if (signerChainId != arbitrumGoerliChainId) {
		const newNetwork = await switchNetwork({ chainId: arbitrumGoerliChainId });
		if (newNetwork.id != arbitrumGoerliChainId) {
			toast.push('Please switch to Arbitrum Goerli Testnet', {
				duration: 2000,
				classes: ['error']
			});
			return;
		}
		signer = await getWalletClient();
	}

	return signer;
};
