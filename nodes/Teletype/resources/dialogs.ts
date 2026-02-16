import type { INodeProperties } from 'n8n-workflow';

export const dialogsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['dialog'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                action: 'List dialogs',
                description: 'List dialogs (placeholder operation)',
            },
        ],
        default: 'list',
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
                resource: ['dialog'],
                operation: ['list'],
            },
        },
    },
    {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        typeOptions: {
            minValue: 0,
        },
        description: 'Pagination offset',
        displayOptions: {
            show: {
                resource: ['dialog'],
                operation: ['list'],
            },
        },
    },
];