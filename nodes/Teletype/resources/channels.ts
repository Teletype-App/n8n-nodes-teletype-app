import type { INodeProperties } from 'n8n-workflow';

export const channelsDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['channel'] } },
        options: [
            { name: 'List', value: 'list', action: 'List channels' },
            { name: 'Send Message', value: 'sendMessage', action: 'Send message via channel' },
        ],
        default: 'list',
    },

    // -------------------------
    // LIST: GET /channels
    // -------------------------
    {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['channel'], operation: ['list'] } },
    },
    {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 500 },
        displayOptions: { show: { resource: ['channel'], operation: ['list'] } },
    },
    {
        displayName: 'Channel Type',
        name: 'channelType',
        type: 'string',
        default: '',
        placeholder: 'whatsapp',
        description: 'Optional filter by channel type',
        displayOptions: { show: { resource: ['channel'], operation: ['list'] } },
    },
    {
        displayName: 'Only Active',
        name: 'onlyActive',
        type: 'boolean',
        default: true,
        description: 'Return only active channels',
        displayOptions: { show: { resource: ['channel'], operation: ['list'] } },
    },

    // -------------------------
    // SEND MESSAGE: POST /channel/send-message (multipart/form-data)
    // -------------------------
    {
        displayName: 'Channel ID',
        name: 'sendChannelId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['channel'], operation: ['sendMessage'] } },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['channel'], operation: ['sendMessage'] } },
    },
    {
        displayName: 'Auto Close',
        name: 'autoClose',
        type: 'boolean',
        default: false,
        description: 'Close dialog after sending',
        displayOptions: { show: { resource: ['channel'], operation: ['sendMessage'] } },
    },

    // Recipient (one of phone/email/username depending on channel)
    {
        displayName: 'Recipient',
        name: 'recipientMode',
        type: 'options',
        options: [
            { name: 'Phone', value: 'phone' },
            { name: 'Email', value: 'email' },
            { name: 'Username', value: 'username' },
        ],
        default: 'phone',
        displayOptions: { show: { resource: ['channel'], operation: ['sendMessage'] } },
    },
    {
        displayName: 'Client Phone',
        name: 'clientPhone',
        type: 'string',
        default: '',
        placeholder: '+79161234567',
        displayOptions: {
            show: { resource: ['channel'], operation: ['sendMessage'], recipientMode: ['phone'] },
        },
    },
    {
        displayName: 'Client Email',
        name: 'clientEmail',
        type: 'string',
        default: '',
        placeholder: 'client@example.com',
        displayOptions: {
            show: { resource: ['channel'], operation: ['sendMessage'], recipientMode: ['email'] },
        },
    },
    {
        displayName: 'Client Username',
        name: 'clientUsername',
        type: 'string',
        default: '',
        placeholder: 'someuser',
        displayOptions: {
            show: { resource: ['channel'], operation: ['sendMessage'], recipientMode: ['username'] },
        },
    },

    // Attachment
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
        description: 'Send a file either from binary input or via URL (file has priority over URL in API)',
        displayOptions: { show: { resource: ['channel'], operation: ['sendMessage'] } },
    },
    {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        displayOptions: {
            show: { resource: ['channel'], operation: ['sendMessage'], attachmentMode: ['binary'] },
        },
    },
    {
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/file.jpg',
        displayOptions: {
            show: { resource: ['channel'], operation: ['sendMessage'], attachmentMode: ['url'] },
        },
    },

    {
        displayName: 'Replied Message ID',
        name: 'repliedMessageId',
        type: 'string',
        default: '',
        description: 'ID of the quoted message (optional)',
        displayOptions: { show: { resource: ['channel'], operation: ['sendMessage'] } },
    },
];