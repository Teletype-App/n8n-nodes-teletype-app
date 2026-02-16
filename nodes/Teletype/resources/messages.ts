import type { INodeProperties } from 'n8n-workflow';

export const messagesDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['message'],
            },
        },
        options: [
            {
                name: 'Send',
                value: 'send',
                action: 'Send message',
                description: 'Send a message (placeholder operation)',
            },
        ],
        default: 'send',
    },
    {
        displayName: 'Dialog ID',
        name: 'dialogId',
        type: 'string',
        required: true,
        default: '',
        placeholder: '19108552',
        description: 'Dialog identifier',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['send'],
            },
        },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Hello!',
        description: 'Message text',
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['send'],
            },
        },
    },
];