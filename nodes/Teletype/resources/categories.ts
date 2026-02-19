import type { INodeProperties } from 'n8n-workflow';

export const categoriesDescription: INodeProperties[] = [
    // Operation
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['category'],
            },
        },
        options: [
            {
                name: 'List',
                value: 'list',
                description: 'Get list of categories in the project',
                action: 'List categories',
            },
            {
                name: 'Set Category for Dialog',
                value: 'setForDialog',
                description: 'Assign category to a dialog',
                action: 'Set category for dialog',
            },
        ],
        default: 'list',
    },

    // Fields
    {
        displayName: 'Dialog ID',
        name: 'dialogId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['category'],
                operation: ['setForDialog'],
            },
        },
        default: '',
        description: 'Dialog identifier',
    },
    {
        displayName: 'Category ID',
        name: 'categoryId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['category'],
                operation: ['setForDialog'],
            },
        },
        default: '',
        description: 'Category identifier (category_appointed_id)',
    },
];