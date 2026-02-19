import type { INodeProperties } from 'n8n-workflow';

export const clientsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['client'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                action: 'List clients',
                description: 'Get list of clients with dialogs in this project',
            },
            {
                name: 'Get Last Dialog',
                value: 'getLastDialog',
                action: 'Get last dialog',
                description: 'Get client dialog by last message date (desc)',
            },
            {
                name: 'Get Details',
                value: 'getDetails',
                action: 'Get client details',
                description: 'Get detailed client information by clientId',
            },
            {
                name: 'Update',
                value: 'update',
                action: 'Update client',
                description: 'Update client fields',
            },
            {
                name: 'Get Custom Fields',
                value: 'getCustomFields',
                action: 'Get custom fields',
                description: 'Get client custom fields',
            },
            {
                name: 'Set Custom Fields',
                value: 'setCustomFields',
                action: 'Set custom fields',
                description: 'Set client custom fields',
            },
        ],
        default: 'list',
    },

    // -------------------------
    // LIST: GET /clients
    // -------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        description: 'Whether to return all results or only up to a limit',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['list'],
            },
        },
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: {
            minValue: 1,
            maxValue: 500,
        },
        description: 'Max number of results to return',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['list'],
                returnAll: [false],
            },
        },
    },
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        typeOptions: { minValue: 1 },
        description: 'Page number',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['list'],
                returnAll: [false],
            },
        },
    },
    {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 500 },
        description: 'Page size',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['list'],
                returnAll: [false],
            },
        },
    },
    {
        displayName: 'Client ID Filter',
        name: 'clientIdFilter',
        type: 'string',
        default: '',
        placeholder: '123456',
        description: 'Filter by clientId (optional)',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['list'],
            },
        },
    },
    {
        displayName: 'Client Phone Filter',
        name: 'clientPhone',
        type: 'string',
        default: '',
        placeholder: '+79161234567',
        description: 'Filter by client phone (optional)',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['list'],
            },
        },
    },

    // -------------------------
    // Shared: clientId for several operations
    // -------------------------
    {
        displayName: 'Client ID',
        name: 'clientId',
        type: 'string',
        required: true,
        default: '',
        placeholder: '123456',
        description: 'Client identifier in Teletype',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['getLastDialog', 'getDetails', 'update', 'getCustomFields', 'setCustomFields'],
            },
        },
    },

    // -------------------------
    // GET LAST DIALOG: GET /client/dialog
    // -------------------------
    {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        default: '',
        description: 'Optional channelId filter',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['getLastDialog'],
            },
        },
    },
    {
        displayName: 'Channel Type',
        name: 'channelType',
        type: 'string',
        default: '',
        placeholder: 'whatsapp',
        description: 'Optional channelType filter',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['getLastDialog'],
            },
        },
    },

    // -------------------------
    // UPDATE: POST /client/update/{clientId} (x-www-form-urlencoded)
    // -------------------------
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['update'],
            },
        },
    },
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['update'],
            },
        },
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['update'],
            },
        },
    },
    {
        displayName: 'Additional Payload',
        name: 'additionalPayload',
        type: 'json',
        default: '{}',
        description: 'Additional payload JSON object',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['update'],
            },
        },
    },
    {
        displayName: 'Force Additional Payload',
        name: 'forceAdditionalPayload',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['update'],
            },
        },
    },

    // -------------------------
    // SET CUSTOM FIELDS: POST /client/set-custom-fields/{clientId}
    // -------------------------
    {
        displayName: 'Custom Fields',
        name: 'customFields',
        type: 'fixedCollection',
        default: {},
        typeOptions: {
            multipleValues: true,
        },
        options: [
            {
                name: 'values',
                displayName: 'Values',
                values: [
                    {
                        displayName: 'Field Key',
                        name: 'key',
                        type: 'string',
                        default: '',
                        placeholder: 'custom_field_1',
                        description: 'Field key without "values[ ]" wrapper',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
        description: 'Will be sent as: values[<key>]=<value>',
        displayOptions: {
            show: {
                resource: ['client'],
                operation: ['setCustomFields'],
            },
        },
    },
];