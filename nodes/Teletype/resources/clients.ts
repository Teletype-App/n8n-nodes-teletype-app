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
                name: 'Get Custom Fields',
                value: 'getCustomFields',
                action: 'Get custom fields',
                description: 'Get custom fields for a client by clientId',
            },
        ],
        default: 'getCustomFields',
    },
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
                operation: ['getCustomFields'],
            },
        },
    },
];