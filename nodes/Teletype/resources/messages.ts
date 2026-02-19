import type { INodeProperties } from 'n8n-workflow';

export const messagesDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['message'] } },
        options: [
            { name: 'List', value: 'list', action: 'List messages' },
            { name: 'Send', value: 'send', action: 'Send message' },
        ],
        default: 'list',
    },

    // -------------------------
    // LIST: GET /messages
    // -------------------------
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['message'], operation: ['list'] } },
    },
    {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 500 },
        displayOptions: { show: { resource: ['message'], operation: ['list'] } },
    },
    {
        displayName: 'Dialog ID',
        name: 'listDialogId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['list'] } },
    },
    {
        displayName: 'Channel ID',
        name: 'listChannelId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['list'] } },
    },
    {
        displayName: 'Client ID',
        name: 'listClientId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['list'] } },
    },

    // -------------------------
    // SEND: POST /message/send (multipart/form-data)
    // -------------------------
    {
        displayName: 'Dialog ID',
        name: 'dialogId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['send'] } },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['send'] } },
    },
    {
        displayName: 'Attachment',
        name: 'attachmentMode',
        type: 'options',
        options: [
            { name: 'None', value: 'none' },
            { name: 'Binary File', value: 'binary' },
            { name: 'URL', value: 'url' },
        ],
        default: 'none',
        displayOptions: { show: { resource: ['message'], operation: ['send'] } },
        description: 'Send a file either from binary input or via URL (file has priority over URL in API)',
    },
    {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        placeholder: 'data',
        displayOptions: {
            show: { resource: ['message'], operation: ['send'], attachmentMode: ['binary'] },
        },
        description: 'Binary property name from the incoming item',
    },
    {
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/file.jpg',
        displayOptions: {
            show: { resource: ['message'], operation: ['send'], attachmentMode: ['url'] },
        },
    },
    {
        displayName: 'Replied Message ID',
        name: 'repliedMessageId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['message'], operation: ['send'] } },
        description: 'ID of the quoted message (optional)',
    },
];