import type { INodeProperties } from 'n8n-workflow';

export const templatesDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: { resource: ['template'] },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'Get quick reply templates inside the project',
                action: 'List templates',
            },
            {
                name: 'List Directories',
                value: 'listDirectories',
                description: 'Get directories (folders) of quick reply templates',
                action: 'List template directories',
            },
        ],
        default: 'list',
    },
];
