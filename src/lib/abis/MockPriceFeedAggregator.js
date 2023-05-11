import { narrow } from 'abitype';

export default narrow([
	{
		inputs: [
			{
				internalType: 'int256',
				name: 'initialPrice',
				type: 'int256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'int256',
				name: 'current',
				type: 'int256'
			},
			{
				indexed: true,
				internalType: 'uint256',
				name: 'roundId',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'updatedAt',
				type: 'uint256'
			}
		],
		name: 'AnswerUpdated',
		type: 'event'
	},
	{
		inputs: [],
		name: 'latestRoundData',
		outputs: [
			{
				internalType: 'uint80',
				name: 'roundId',
				type: 'uint80'
			},
			{
				internalType: 'int256',
				name: 'answer',
				type: 'int256'
			},
			{
				internalType: 'uint256',
				name: 'startedAt',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'updatedAt',
				type: 'uint256'
			},
			{
				internalType: 'uint80',
				name: 'answeredInRound',
				type: 'uint80'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'roundData',
		outputs: [
			{
				internalType: 'uint80',
				name: 'roundId',
				type: 'uint80'
			},
			{
				internalType: 'int256',
				name: 'answer',
				type: 'int256'
			},
			{
				internalType: 'uint256',
				name: 'startedAt',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'updatedAt',
				type: 'uint256'
			},
			{
				internalType: 'uint80',
				name: 'answeredInRound',
				type: 'uint80'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'int256',
				name: 'newPrice',
				type: 'int256'
			}
		],
		name: 'setNewPrice',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
]);
