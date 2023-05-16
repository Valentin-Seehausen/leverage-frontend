import { createDialog } from 'svelte-headlessui';
import { writable } from 'svelte/store';

export const positionDetailsDialog = createDialog({ label: 'Position Details' });
/**
 * @typedef {import('$lib/utils/position').Position} Position
 */

const createPositionDetailsModal = () => {
	/**
	 * @type {import('svelte/store').Writable<Position | undefined>}
	 */
	const { subscribe, set } = writable(undefined);

	let scrollY = 0;
	let prevBodyPosition = '';
	let prevBodyOverflow = '';
	let prevBodyWidth = '';

	const disableScroll = () => {
		scrollY = window.scrollY;
		prevBodyPosition = document.body.style.position;
		prevBodyOverflow = document.body.style.overflow;
		prevBodyWidth = document.body.style.width;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.overflow = 'hidden';
		document.body.style.width = '100%';
	};

	const enableScroll = () => {
		document.body.style.position = prevBodyPosition || '';
		document.body.style.top = '';
		document.body.style.overflow = prevBodyOverflow || '';
		document.body.style.width = prevBodyWidth || '';
		window.scrollTo({
			top: scrollY,
			left: 0
		});
	};

	// This store gets created once and never gets destroyed.
	// So this subscription will never get unsubscribed.
	positionDetailsDialog.subscribe((state) => {
		if (state.expanded) {
			disableScroll();
		} else {
			enableScroll();
		}
	});

	return {
		subscribe,
		/**
		 * @param {Position} position
		 */
		open: (position) => {
			set(position);
			positionDetailsDialog.open();
		},
		close: () => {
			positionDetailsDialog.close();
		}
	};
};

export const positionDetailsModal = createPositionDetailsModal();
