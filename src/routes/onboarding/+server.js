import { json } from '@sveltejs/kit';
import { BACKEND_PK } from '$env/static/private';
import { createWalletClient, createPublicClient, http, parseAbi } from 'viem';
import { arbitrumGoerli } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const publicClient = createPublicClient({
	chain: arbitrumGoerli,
	transport: http('https://arb-goerli.g.alchemy.com/v2/lUQtY9raHlem8U5eqFJAhsZHSXoB7hr0')
});

const account = privateKeyToAccount(`0x${BACKEND_PK}`);

const walletClient = createWalletClient({
	account,
	chain: arbitrumGoerli,
	transport: http('https://arb-goerli.g.alchemy.com/v2/lUQtY9raHlem8U5eqFJAhsZHSXoB7hr0')
});

export async function POST({ request }) {
	const { user } = await request.json();

	try {
		const { request } = await publicClient.simulateContract({
			account,
			address: '0xdec580deeebc1532acb3e1ff04a7a635f91d6c2a',
			abi: parseAbi(['function sendFunds(address)', 'error CooldownPeriodNotElapsed(uint256)']),
			functionName: 'sendFunds',
			args: [user]
		});

		const hash = await walletClient.writeContract(request);
		await publicClient.waitForTransactionReceipt({ hash });

		return json({ hash }, { status: 200 });
	} catch (error) {
		return json({ error: error?.toString() }, { status: 400 });
	}
}
