import { json } from '@sveltejs/kit';
import { BACKEND_PK } from '$env/static/private';
import { parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { config } from '$lib/stores/client.js';
import { simulateContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { arbitrumSepolia } from 'viem/chains';

const account = privateKeyToAccount(`0x${BACKEND_PK}`);

export async function POST({ request }) {
	const { user } = await request.json();

	try {
		const { request } = await simulateContract(config, {
			account,
			address: '0x266951D992Dcb5B4b5554f8B2B8B88E8547e3B76',
			abi: parseAbi(['function sendFunds(address)', 'error CooldownPeriodNotElapsed(uint256)']),
			functionName: 'sendFunds',
			args: [user],
			chainId: arbitrumSepolia.id
		});

		const hash = await writeContract(config, request);
		await waitForTransactionReceipt(config, { hash });

		// Give RPC Provider time to update
		await new Promise((resolve) => setTimeout(resolve, 500));

		return json({ hash }, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: error?.toString() }, { status: 400 });
	}
}
