import type { INodeProperties } from 'n8n-workflow';

export const dialogsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['dialog'] } },
        options: [
            { name: 'List', value: 'list', action: 'List dialogs' },
            { name: 'Get Details', value: 'getDetails', action: 'Get dialog details' },
            { name: 'Get Group Clients', value: 'getGroupClients', action: 'Get group dialog clients' },
            { name: 'Close', value: 'close', action: 'Close dialog' },
            { name: 'Mark Seen', value: 'markSeen', action: 'Mark dialog seen' },
            { name: 'Set Operator', value: 'setOperator', action: 'Set operator for dialog' },
            { name: 'Create', value: 'create', action: 'Create dialog' },
            { name: 'Mark Answered', value: 'markAnswered', action: 'Mark dialog answered' },
            { name: 'Mark Unanswered', value: 'markUnanswered', action: 'Mark dialog unanswered' },
        ],
        default: 'list',
    },

    // -------------------------
    // LIST: GET /dialogs
    // -------------------------
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['dialog'], operation: ['list'] } },
    },
    {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 500 },
        displayOptions: { show: { resource: ['dialog'], operation: ['list'] } },
    },
    {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
            { name: 'All', value: 'all' },
            { name: 'Open', value: 'open' },
            { name: 'Close', value: 'close' },
        ],
        default: 'all',
        displayOptions: { show: { resource: ['dialog'], operation: ['list'] } },
    },
    {
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['dialog'], operation: ['list'] } },
    },
    {
        displayName: 'Channel Type',
        name: 'channelType',
        type: 'string',
        default: '',
        placeholder: 'whatsapp',
        displayOptions: { show: { resource: ['dialog'], operation: ['list'] } },
    },

    // -------------------------
    // Shared: dialogId
    // -------------------------
    {
        displayName: 'Dialog ID',
        name: 'dialogId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['dialog'],
                operation: [
                    'getDetails',
                    'getGroupClients',
                    'close',
                    'markSeen',
                    'setOperator',
                    'markAnswered',
                    'markUnanswered',
                ],
            },
        },
    },

    // -------------------------
    // Set Operator: POST /dialog/set-operator/{dialogId}
    // -------------------------
    {
        displayName: 'Operator ID',
        name: 'operatorId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['dialog'], operation: ['setOperator'] } },
    },

    // -------------------------
    // Create: POST /dialog/create
    // -------------------------
    {
        displayName: 'Channel ID',
        name: 'createChannelId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['dialog'], operation: ['create'] } },
    },
    {
        displayName: 'Client Phone',
        name: 'createClientPhone',
        type: 'string',
        default: '',
        placeholder: '+79161234567',
        displayOptions: { show: { resource: ['dialog'], operation: ['create'] } },
    },
    {
        displayName: 'Client Email',
        name: 'createClientEmail',
        type: 'string',
        default: '',
        placeholder: 'client@example.com',
        displayOptions: { show: { resource: ['dialog'], operation: ['create'] } },
    },
];