import type {
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
    IWebhookResponseData,
    IDataObject,
    GenericValue,
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

// Приводим любые значения к формату, допустимому для IDataObject/GenericValue
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

    // bigint/symbol/function/undefined и т.п.
    try {
        return String(value);
    } catch {
        return null;
    }
}

export class TeletypeTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Teletype Trigger',
        name: 'teletypeTrigger',
        icon: 'file:../../icons/teletype.svg',
        group: ['trigger'],
        version: 1,
        description: 'Triggers on Teletype webhooks',
        defaults: { name: 'Teletype Trigger' },

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
                description: 'If empty, all events are accepted',
            },
            {
                displayName: 'Parse Payload JSON',
                name: 'parsePayloadJson',
                type: 'boolean',
                default: true,
                description: 'Attempt to parse payload as JSON if it is a string',
            },
            {
                displayName: 'Include Headers',
                name: 'includeHeaders',
                type: 'boolean',
                default: false,
                description: 'Include request headers into output item',
            },
            {
                displayName: 'Include Query',
                name: 'includeQuery',
                type: 'boolean',
                default: false,
                description: 'Include query parameters into output item',
            },
            {
                displayName: 'Strict Event Field',
                name: 'strictEventField',
                type: 'boolean',
                default: true,
                description:
                    'If enabled and incoming webhook has no "name" field, the node will throw an error',
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
        const body = (bodyUnknown && typeof bodyUnknown === 'object'
            ? (bodyUnknown as Record<string, unknown>)
            : {}) as Record<string, unknown>;

        // Teletype: multipart/form-data { name, payload }
        const name = (body.name ?? body.event ?? body.type) as string | undefined;

        let payload: unknown = body.payload;

        // payload часто приходит как строка JSON
        if (parsePayloadJson && typeof payload === 'string') {
            const s = payload.trim();
            if (
                (s.startsWith('{') && s.endsWith('}')) ||
                (s.startsWith('[') && s.endsWith(']'))
            ) {
                try {
                    payload = JSON.parse(s);
                } catch {
                    // оставляем строкой
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