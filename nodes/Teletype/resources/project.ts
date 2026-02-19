import type { INodeProperties } from 'n8n-workflow';

const WEBHOOK_TYPES = [
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
];

export const projectDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: { resource: ['project'] },
        },
        options: [
            {
                name: 'Get Balance',
                value: 'getBalance',
                description: 'Get project balance information',
                action: 'Get balance',
            },
            {
                name: 'Get Operators',
                value: 'getOperators',
                description: 'Get operators connected to the project',
                action: 'Get operators',
            },
            {
                name: 'Get API Status',
                value: 'getApiStatus',
                description: 'Get Public API status for the project',
                action: 'Get API status',
            },
            {
                name: 'Get Details',
                value: 'getDetails',
                description: 'Get project details (id, name, domain, etc.)',
                action: 'Get project details',
            },
            {
                name: 'Get Tariff',
                value: 'getTariff',
                description: 'Get tariff information',
                action: 'Get tariff',
            },
            {
                name: 'Update Public API Settings',
                value: 'updatePublicApi',
                description: 'Update Public API webhook and active webhook types',
                action: 'Update public API settings',
            },
        ],
        default: 'getDetails',
    },

    // --- fields for updatePublicApi ---
    {
        displayName: 'API Webhook URL',
        name: 'apiWebhook',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['project'],
                operation: ['updatePublicApi'],
            },
        },
        default: '',
        description: 'New value for api_webhook (leave empty to not change)',
    },

    {
        displayName: 'Active Webhooks',
        name: 'activeWebhooks',
        type: 'multiOptions',
        displayOptions: {
            show: {
                resource: ['project'],
                operation: ['updatePublicApi'],
            },
        },
        options: WEBHOOK_TYPES.map((t) => ({ name: t, value: t })),
        default: [],
        description: 'List of active webhook types for the project',
    },
];