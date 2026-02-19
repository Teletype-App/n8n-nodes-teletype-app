import type { INodeProperties } from 'n8n-workflow';

export const tagOperationsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['tag'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'Get tags available in the project',
                action: 'List tags',
            },
            {
                name: 'Add Tag to Client',
                value: 'addToClient',
                description: 'Assign a tag to a client',
                action: 'Add tag to client',
            },
            {
                name: 'Remove Tag from Client',
                value: 'removeFromClient',
                description: 'Remove a tag from a client',
                action: 'Remove tag from client',
            },
        ],
        default: 'list',
    },
];

export const tagFieldsDescription: INodeProperties[] = [
    {
        displayName: 'Client ID',
        name: 'clientId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['tag'],
                operation: ['addToClient', 'removeFromClient'],
            },
        },
        default: '',
        description: 'Client identifier',
    },
    {
        displayName: 'Tag ID',
        name: 'tagId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['tag'],
                operation: ['addToClient', 'removeFromClient'],
            },
        },
        default: '',
        description: 'Tag identifier',
    },
];