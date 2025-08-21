import type { MessageEventBusDestinationOptions } from 'n8n-workflow';
import {
	deleteDestinationFromDb,
	getDestinationsFromBackend,
	getEventNamesFromBackend,
	hasDestinationId,
	saveDestinationToDb,
	sendTestMessageToDestination,
} from '@n8n/rest-api-client/api/eventbus.ee';
import { useRootStore } from '@n8n/stores/useRootStore';
import { create } from 'zustand';

export interface EventSelectionItem {
	selected: boolean;
	indeterminate: boolean;
	name: string;
	label: string;
}

interface EventSelectionGroup extends EventSelectionItem {
	children: EventSelectionItem[];
}

interface DestinationStoreItem {
	destination: MessageEventBusDestinationOptions;
	selectedEvents: Set<string>;
	eventGroups: EventSelectionGroup[];
	isNew: boolean;
}

export interface DestinationSettingsStore {
	[key: string]: DestinationStoreItem;
}

const eventGroupFromEventName = (eventName: string): string | undefined => {
	const matches = eventName.match(/^[\w\s]+\.[\w\s]+/);
	if (matches && matches?.length > 0) {
		return matches[0];
	}
	return undefined;
};

const prettifyEventName = (label: string, group = ''): string => {
	label = label.replace(group + '.', '');
	if (label.length > 0) {
		label = label[0].toUpperCase() + label.substring(1);
		label = label.replaceAll('.', ' ');
	}
	return label;
};

const eventGroupsFromStringList = (
	dottedList: Set<string>,
	selectionList: Set<string> = new Set(),
) => {
	const result = [] as EventSelectionGroup[];
	const eventNameArray = Array.from(dottedList.values());

	const groups: Set<string> = new Set<string>();
	groups.add('n8n.workflow');
	groups.add('n8n.node');

	for (const eventName of eventNameArray) {
		const matches = eventName.match(/^[\w\s]+\.[\w\s]+/);
		if (matches && matches?.length > 0) groups.add(matches[0]);
	}

	for (const group of groups) {
		const collection: EventSelectionGroup = {
			children: [],
			label: group,
			name: group,
			selected: selectionList.has(group),
			indeterminate: false,
		};
		const eventsOfGroup = eventNameArray.filter((e) => e.startsWith(group));
		for (const event of eventsOfGroup) {
			if (!collection.selected && selectionList.has(event)) collection.indeterminate = true;
			const subCollection: EventSelectionItem = {
				label: prettifyEventName(event, group),
				name: event,
				selected: selectionList.has(event),
				indeterminate: false,
			};
			collection.children.push(subCollection);
		}
		result.push(collection);
	}
	return result;
};

type LogStreamingState = {
	items: DestinationSettingsStore;
	eventNames: Set<string>;

	addDestination: (destination: MessageEventBusDestinationOptions) => void;
	setSelectionAndBuildItems: (destination: MessageEventBusDestinationOptions) => void;
	getDestination: (destinationId: string) => MessageEventBusDestinationOptions | undefined;
	getAllDestinations: () => MessageEventBusDestinationOptions[];
	clearDestinations: () => void;
	addEventName: (name: string) => void;
	removeEventName: (name: string) => void;
	clearEventNames: () => void;
	setSelectedInGroup: (destinationId: string, name: string, isSelected: boolean) => void;
	addSelectedEvent: (id: string, name: string) => void;
	removeSelectedEvent: (id: string, name: string) => void;
	removeDestinationItemTree: (id: string) => void;
	updateDestination: (destination: MessageEventBusDestinationOptions) => void;
	removeDestination: (destinationId: string) => void;
	getSelectedEvents: (destinationId: string) => string[];
	saveDestination: (destination: MessageEventBusDestinationOptions) => Promise<boolean>;
	sendTestMessage: (destination: MessageEventBusDestinationOptions) => Promise<boolean>;
	fetchEventNames: () => Promise<string[]>;
	fetchDestinations: () => Promise<MessageEventBusDestinationOptions[]>;
	deleteDestination: (destinationId: string) => Promise<void>;
};

export const useLogStreamingStore = create<LogStreamingState>((set, get) => {
	const rootStore = useRootStore();

	const setSelectionAndBuildItems = (destination: MessageEventBusDestinationOptions) => {
		const { items, eventNames } = get();
		if (!destination.id) return;
		if (!items[destination.id]) {
			items[destination.id] = {
				destination,
				selectedEvents: new Set<string>(),
				eventGroups: [],
				isNew: false,
			} as DestinationStoreItem;
		}
		items[destination.id]?.selectedEvents?.clear();
		if (destination.subscribedEvents) {
			for (const eventName of destination.subscribedEvents) {
				items[destination.id]?.selectedEvents?.add(eventName);
			}
		}
		items[destination.id].eventGroups = eventGroupsFromStringList(
			eventNames,
			items[destination.id]?.selectedEvents,
		);
		set({ items: { ...items } });
	};

	const addDestination = (destination: MessageEventBusDestinationOptions) => {
		const { items } = get();
		if (destination.id && items[destination.id]) {
			items[destination.id].destination = destination;
			set({ items: { ...items } });
		} else {
			setSelectionAndBuildItems(destination);
		}
	};

	const getDestination = (destinationId: string) => get().items[destinationId]?.destination;

	const getAllDestinations = () => Object.values(get().items).map((item) => item.destination);

	const clearDestinations = () => set({ items: {} });

	const addEventName = (name: string) => set((s) => { const next = new Set(s.eventNames); next.add(name); return { eventNames: next }; });
	const removeEventName = (name: string) => set((s) => { const next = new Set(s.eventNames); next.delete(name); return { eventNames: next }; });
	const clearEventNames = () => set({ eventNames: new Set() });

	const setSelectedInGroup = (destinationId: string, name: string, isSelected: boolean) => {
		const { items } = get();
		if (!items[destinationId]) return;
		const groupName = eventGroupFromEventName(name);
		const group = items[destinationId].eventGroups.find((e) => e.name === groupName);
		if (!group) return;
		const children = group.children;
		if (groupName === name) {
			group.selected = isSelected;
			group.indeterminate = false;
			children.forEach((e) => (e.selected = false));
			set({ items: { ...items } });
			return;
		}
		const event = children.find((e) => e.name === name);
		if (!event) return;
		event.selected = isSelected;
		if (!isSelected && group.selected) {
			group.selected = false;
			group.children.filter((e) => e !== event).forEach((e) => (e.selected = true));
		}
		const selectedChildren = children.filter((e) => e.selected);
		if (isSelected && selectedChildren.length === children.length) {
			group.selected = true;
			group.children.forEach((e) => (e.selected = false));
		}
		group.indeterminate = selectedChildren.length > 0 && selectedChildren.length < children.length;
		set({ items: { ...items } });
	};

	const addSelectedEvent = (id: string, name: string) => { const { items } = get(); items[id]?.selectedEvents?.add(name); set({ items: { ...items } }); setSelectedInGroup(id, name, true); };
	const removeSelectedEvent = (id: string, name: string) => { const { items } = get(); items[id]?.selectedEvents?.delete(name); set({ items: { ...items } }); setSelectedInGroup(id, name, false); };
	const removeDestinationItemTree = (id: string) => { const { items } = get(); delete items[id]; set({ items: { ...items } }); };
	const updateDestination = (destination: MessageEventBusDestinationOptions) => { const { items } = get(); if (destination.id && items[destination.id]) { items[destination.id].destination = destination; set({ items: { ...items } }); } };
	const removeDestination = (destinationId: string) => { if (!destinationId) return; const { items } = get(); delete items[destinationId]; set({ items: { ...items } }); };

	const getSelectedEvents = (destinationId: string): string[] => {
		const sel: string[] = [];
		const { items } = get();
		if (!items[destinationId]) return sel;
		for (const group of items[destinationId].eventGroups) {
			if (group.selected) sel.push(group.name);
			for (const event of group.children) if (event.selected) sel.push(event.name);
		}
		return sel;
	};

	const saveDestination = async (
		destination: MessageEventBusDestinationOptions,
	): Promise<boolean> => {
		if (!hasDestinationId(destination)) return false;
		const selectedEvents = getSelectedEvents(destination.id);
		try {
			await saveDestinationToDb(rootStore.restApiContext, destination, selectedEvents);
			updateDestination(destination);
			return true;
		} catch {
			return false;
		}
	};

	const sendTestMessage = async (
		destination: MessageEventBusDestinationOptions,
	): Promise<boolean> => {
		if (!hasDestinationId(destination)) return false;
		const testResult = await sendTestMessageToDestination(rootStore.restApiContext, destination);
		return testResult;
	};

	const fetchEventNames = async () => await getEventNamesFromBackend(rootStore.restApiContext);
	const fetchDestinations = async (): Promise<MessageEventBusDestinationOptions[]> => await getDestinationsFromBackend(rootStore.restApiContext);
	const deleteDestination = async (destinationId: string) => { await deleteDestinationFromDb(rootStore.restApiContext, destinationId); removeDestination(destinationId); };

	return {
		items: {},
		eventNames: new Set<string>(),
		addDestination,
		setSelectionAndBuildItems,
		getDestination,
		getAllDestinations,
		clearDestinations,
		addEventName,
		removeEventName,
		clearEventNames,
		addSelectedEvent,
		removeSelectedEvent,
		setSelectedInGroup,
		removeDestinationItemTree,
		updateDestination,
		removeDestination,
		getSelectedEvents,
		saveDestination,
		sendTestMessage,
		fetchEventNames,
		fetchDestinations,
		deleteDestination,
	};
});
