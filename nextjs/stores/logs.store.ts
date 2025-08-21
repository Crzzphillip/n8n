import { type LogDetailsPanelState } from '@/features/logs/logs.types';
import { useTelemetry } from '@/composables/useTelemetry';
import { LOG_DETAILS_PANEL_STATE, LOGS_PANEL_STATE } from '@/features/logs/logs.constants';
import { create } from 'zustand';

type LogsStore = {
	isOpen: boolean;
	preferPoppedOut: boolean;
	height: number;
	detailsState: LogDetailsPanelState;
	detailsStateSubNode: LogDetailsPanelState;
	isLogSelectionSyncedWithCanvas: boolean;
	isSubNodeSelected: boolean;

	// selectors
	getStateMode: () => (typeof LOGS_PANEL_STATE)[keyof typeof LOGS_PANEL_STATE];
	getIsOpen: () => boolean;
	getDetailsState: () => LogDetailsPanelState;

	// actions
	setHeight: (value: number) => void;
	toggleOpen: (value?: boolean) => void;
	setPreferPoppedOut: (value: boolean) => void;
	setSubNodeSelected: (value: boolean) => void;
	toggleInputOpen: (open?: boolean) => void;
	toggleOutputOpen: (open?: boolean) => void;
	toggleLogSelectionSync: (value?: boolean) => void;
};

const readLocalBool = (key: string, def: boolean) => {
	if (typeof window === 'undefined') return def;
	const raw = window.localStorage.getItem(key);
	if (raw === null) return def;
	try { return JSON.parse(raw) as boolean; } catch { return def; }
};
const writeLocalBool = (key: string, val: boolean) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(key, JSON.stringify(val));
};

export const useLogsStore = create<LogsStore>((set, get) => {
	const telemetry = useTelemetry();
	// Keys preserved; defaults if missing
	const KEY_OPEN = 'LOGS_PANEL_OPEN';
	const KEY_SYNC = 'LOGS_SYNC_SELECTION';
	const KEY_DETAILS = 'LOGS_PANEL_DETAILS_PANEL';
	const KEY_DETAILS_SUB = 'LOGS_PANEL_DETAILS_PANEL_SUB_NODE';

	const initialIsOpen = readLocalBool(KEY_OPEN, false);
	const initialSync = readLocalBool(KEY_SYNC, true);
	const initialDetails = (() => {
		if (typeof window === 'undefined') return LOG_DETAILS_PANEL_STATE.OUTPUT as LogDetailsPanelState;
		const raw = window.localStorage.getItem(KEY_DETAILS);
		return (raw ? (JSON.parse(raw) as LogDetailsPanelState) : LOG_DETAILS_PANEL_STATE.OUTPUT);
	})();
	const initialDetailsSub = (() => {
		if (typeof window === 'undefined') return LOG_DETAILS_PANEL_STATE.BOTH as LogDetailsPanelState;
		const raw = window.localStorage.getItem(KEY_DETAILS_SUB);
		return (raw ? (JSON.parse(raw) as LogDetailsPanelState) : LOG_DETAILS_PANEL_STATE.BOTH);
	})();

	return {
		isOpen: initialIsOpen,
		preferPoppedOut: false,
		height: 0,
		detailsState: initialDetails,
		detailsStateSubNode: initialDetailsSub,
		isLogSelectionSyncedWithCanvas: initialSync,
		isSubNodeSelected: false,

		getStateMode: () => {
			const { isOpen, preferPoppedOut } = get();
			if (!isOpen) return LOGS_PANEL_STATE.CLOSED;
			return preferPoppedOut ? LOGS_PANEL_STATE.FLOATING : LOGS_PANEL_STATE.ATTACHED;
		},
		getIsOpen: () => get().getStateMode() !== LOGS_PANEL_STATE.CLOSED,
		getDetailsState: () => (get().isSubNodeSelected ? get().detailsStateSubNode : get().detailsState),

		setHeight: (value) => set({ height: value }),
		toggleOpen: (value) => set((s) => {
			const next = value ?? !s.isOpen;
			writeLocalBool(KEY_OPEN, next);
			return { isOpen: next };
		}),
		setPreferPoppedOut: (value) => set({ preferPoppedOut: value }),
		setSubNodeSelected: (value) => set({ isSubNodeSelected: value }),
		toggleInputOpen: (open) => set((s) => {
			const statesWithInput = [LOG_DETAILS_PANEL_STATE.INPUT, LOG_DETAILS_PANEL_STATE.BOTH] as LogDetailsPanelState[];
			const current = s.isSubNodeSelected ? s.detailsStateSubNode : s.detailsState;
			const wasOpen = statesWithInput.includes(current);
			if (open === wasOpen) return {};
			const next = wasOpen ? LOG_DETAILS_PANEL_STATE.OUTPUT : LOG_DETAILS_PANEL_STATE.BOTH;
			telemetry.track('User toggled log view sub pane', {
				pane: 'input',
				newState: wasOpen ? 'hidden' : 'visible',
				isSubNode: s.isSubNodeSelected,
			});
			if (s.isSubNodeSelected) {
				if (typeof window !== 'undefined') window.localStorage.setItem(KEY_DETAILS_SUB, JSON.stringify(next));
				return { detailsStateSubNode: next };
			} else {
				if (typeof window !== 'undefined') window.localStorage.setItem(KEY_DETAILS, JSON.stringify(next));
				return { detailsState: next };
			}
		}),
		toggleOutputOpen: (open) => set((s) => {
			const statesWithOutput = [LOG_DETAILS_PANEL_STATE.OUTPUT, LOG_DETAILS_PANEL_STATE.BOTH] as LogDetailsPanelState[];
			const current = s.isSubNodeSelected ? s.detailsStateSubNode : s.detailsState;
			const wasOpen = statesWithOutput.includes(current);
			if (open === wasOpen) return {};
			const next = wasOpen ? LOG_DETAILS_PANEL_STATE.INPUT : LOG_DETAILS_PANEL_STATE.BOTH;
			telemetry.track('User toggled log view sub pane', {
				pane: 'output',
				newState: wasOpen ? 'hidden' : 'visible',
				isSubNode: s.isSubNodeSelected,
			});
			if (s.isSubNodeSelected) {
				if (typeof window !== 'undefined') window.localStorage.setItem(KEY_DETAILS_SUB, JSON.stringify(next));
				return { detailsStateSubNode: next };
			} else {
				if (typeof window !== 'undefined') window.localStorage.setItem(KEY_DETAILS, JSON.stringify(next));
				return { detailsState: next };
			}
		}),
		toggleLogSelectionSync: (value) => set((s) => {
			const next = value ?? !s.isLogSelectionSyncedWithCanvas;
			writeLocalBool(KEY_SYNC, next);
			return { isLogSelectionSyncedWithCanvas: next };
		}),
	};
});
