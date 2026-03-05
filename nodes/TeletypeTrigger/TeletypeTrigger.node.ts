import type {
	IDataObject,
	GenericValue,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const EVENT_TYPES = [
	'new message',
	'success send',
	'message status change',
	'new note',
	'new dialog',
	'open dialog',
	'close dialog',
	'person change',
	'appeal rate',
	'messages templates updated',
	'session operator changed',
	'channel deleted',
];

function toGenericValue(value: unknown): GenericValue {
	if (value === null) return null;
	const t = typeof value;

	if (t === 'string' || t === 'number' || t === 'boolean') return value;

	if (value instanceof Date) return value.toISOString();

	if (Array.isArray(value)) {
		return value.map((v) => toGenericValue(v));
	}

	if (t === 'object') {
		const obj = value as Record<string, unknown>;
		const out: IDataObject = {};
		for (const [k, v] of Object.entries(obj)) {
			out[k] = toGenericValue(v);
		}
		return out;
	}

	try {
		return String(value);
	} catch {
		return null;
	}
}

export class TeletypeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teletype App Trigger',
		name: 'teletypeTrigger',
		icon: 'file:../../icons/teletype.svg',
		group: ['trigger'],
		version: 1,
		description: 'Запускается при получении webhook от Teletype',
		defaults: { name: 'Teletype App Trigger' },
		usableAsTool: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'teletype',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				default: [],
				options: EVENT_TYPES.map((e) => ({ name: e, value: e })),
				description: 'Если список пуст, будут приниматься все события',
			},
			{
				displayName: 'Parse Payload JSON',
				name: 'parsePayloadJson',
				type: 'boolean',
				default: true,
				description: 'Whether to parse the payload field as JSON, если оно пришло строкой',
			},
			{
				displayName: 'Include Headers',
				name: 'includeHeaders',
				type: 'boolean',
				default: false,
				description: 'Whether to include HTTP headers in the output item (добавлять HTTP-заголовки в выходные данные)',
			},
			{
				displayName: 'Include Query',
				name: 'includeQuery',
				type: 'boolean',
				default: false,
				description: 'Whether to include query parameters in the output item (добавлять query-параметры в выходные данные)',
			},
			{
				displayName: 'Strict Event Field',
				name: 'strictEventField',
				type: 'boolean',
				default: true,
				description: 'Whether to throw an error if the incoming webhook has no name field (выдавать ошибку, если нет поля name)',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const events = this.getNodeParameter('events', 0) as string[];
		const parsePayloadJson = this.getNodeParameter('parsePayloadJson', 0) as boolean;
		const includeHeaders = this.getNodeParameter('includeHeaders', 0) as boolean;
		const includeQuery = this.getNodeParameter('includeQuery', 0) as boolean;
		const strictEventField = this.getNodeParameter('strictEventField', 0) as boolean;

		const bodyUnknown = this.getBodyData() ?? {};
		const body = (bodyUnknown && typeof bodyUnknown === 'object' ? (bodyUnknown as Record<string, unknown>) : {}) as Record<
			string,
			unknown
		>;

		const name = (body.name ?? body.event ?? body.type) as string | undefined;
		let payload: unknown = body.payload;

		if (parsePayloadJson && typeof payload === 'string') {
			const s = payload.trim();
			if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
				try {
					payload = JSON.parse(s);
				} catch {
					// Keep original string payload if JSON parsing fails.
				}
			}
		}

		if (!name) {
			if (strictEventField) {
				throw new NodeOperationError(
					this.getNode(),
					'Incoming Teletype webhook has no "name" field. Expected multipart/form-data with fields: name, payload.',
				);
			}
		} else if (events.length > 0 && !events.includes(name)) {
			return { workflowData: [[]] };
		}

		const out: IDataObject = {
			name: name ?? null,
			payload: toGenericValue(payload),
			rawBody: toGenericValue(body),
		};

		if (includeHeaders) out.headers = toGenericValue(this.getHeaderData());
		if (includeQuery) out.query = toGenericValue(this.getQueryData());

		const item: INodeExecutionData = { json: out };

		return { workflowData: [[item]] };
	}
}
