import {
	NodeConnectionTypes,
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import { clientsDescription } from './resources/clients';
import { dialogsDescription } from './resources/dialogs';
import { messagesDescription } from './resources/messages';
import { channelsDescription } from './resources/channels';
import { tagOperationsDescription, tagFieldsDescription } from './resources/tag';
import { categoriesDescription } from './resources/categories';
import { notesDescription } from './resources/notes';
import { templatesDescription } from './resources/templates';
import { projectDescription } from './resources/project';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type MultipartPrimitive = string | number | boolean;
type MultipartFields = Record<string, MultipartPrimitive | MultipartPrimitive[]>;
type MultipartFile = {
	buffer: Buffer;
	filename: string;
	contentType: string;
};

function toUrlEncodedBody(data: Record<string, unknown>): string {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(data)) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			for (const item of value) {
				if (item === undefined || item === null) continue;
				params.append(key, String(item));
			}
			continue;
		}

		params.append(key, String(value));
	}

	return params.toString();
}

function extractMultipartParts(formData: Record<string, unknown>): {
	fields: MultipartFields;
	file?: MultipartFile;
} {
	const fields: MultipartFields = {};
	let file: MultipartFile | undefined;

	for (const [key, value] of Object.entries(formData)) {
		if (value === undefined || value === null) continue;

		if (key === 'file' && typeof value === 'object' && value !== null) {
			const fileCandidate = value as {
				value?: unknown;
				options?: { filename?: string; contentType?: string };
			};
			if (Buffer.isBuffer(fileCandidate.value)) {
				file = {
					buffer: fileCandidate.value,
					filename: fileCandidate.options?.filename || 'attachment',
					contentType: fileCandidate.options?.contentType || 'application/octet-stream',
				};
				continue;
			}
		}

		if (Array.isArray(value)) {
			fields[key] = value.map((item) => String(item));
			continue;
		}

		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			fields[key] = value;
			continue;
		}

		fields[key] = String(value);
	}

	return { fields, file };
}

async function sendMultipartRequest(
	url: string,
	token: string,
	fields: MultipartFields,
	file?: MultipartFile,
): Promise<unknown> {
	const body = new FormData();

	for (const [key, value] of Object.entries(fields)) {
		if (Array.isArray(value)) {
			for (const item of value) {
				body.append(key, String(item));
			}
			continue;
		}
		body.append(key, String(value));
	}

	if (file) {
		const blob = new Blob([file.buffer], { type: file.contentType });
		body.append('file', blob, file.filename);
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'X-Auth-Token': token,
			Accept: 'application/json',
		},
		body,
	});

	const text = await response.text();
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

export class Teletype implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teletype App',
		name: 'teletype',
		icon: 'file:../../icons/teletype.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Инструмент для работы с Public API Teletype App',
		defaults: {
			name: 'Teletype App',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'teletypeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl || "https://api.teletype.app/public/api/v1"}}',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Category', value: 'category' },
					{ name: 'Channel', value: 'channel' },
					{ name: 'Client', value: 'client' },
					{ name: 'Dialog', value: 'dialog' },
					{ name: 'Message', value: 'message' },
					{ name: 'Note', value: 'note' },
					{ name: 'Project', value: 'project' },
					{ name: 'Tag', value: 'tag' },
					{ name: 'Template', value: 'template' },
				],
				default: 'client',
			},
			...clientsDescription,
			...dialogsDescription,
			...messagesDescription,
			...channelsDescription,
			...tagOperationsDescription,
			...tagFieldsDescription,
			...categoriesDescription,
			...notesDescription,
			...templatesDescription,
			...projectDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const creds = await this.getCredentials<{ baseUrl: string; token: string }>('teletypeApi');
		const baseUrl = (creds.baseUrl || 'https://api.teletype.app/public/api/v1').replace(/\/+$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				let method: HttpMethod = 'GET';
				let url = '';
				let qs: Record<string, string | number | boolean> | undefined;

				if (resource === 'client') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/clients`;

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const clientIdFilter = this.getNodeParameter('clientIdFilter', i) as string;
						const clientPhone = this.getNodeParameter('clientPhone', i) as string;

						if (returnAll) {
							// Простой безопасный авто-пейджинг.
							// Если API не поддерживает page/pageSize — уберём и перепишем под их параметры.
							const collected: unknown[] = [];
							let page = 1;
							const pageSize = 200;

							while (true) {
								const pageQs: Record<string, string | number | boolean> = { page, pageSize };
								if (clientIdFilter) pageQs.clientId = clientIdFilter;
								if (clientPhone) pageQs.clientPhone = clientPhone;

								const resp = await this.helpers.httpRequestWithAuthentication.call(
									this,
									'teletypeApi',
									{
										method: 'GET',
										url,
										qs: pageQs,
										json: true,
									},
								);

								// Ожидаем массив. Если API вернёт объект с полем data/items — скажешь, и я подстрою.
								const data = Array.isArray(resp) ? resp : (resp?.data ?? resp?.items);
								if (!Array.isArray(data) || data.length === 0) break;

								collected.push(...data);

								if (data.length < pageSize) break;
								page += 1;
							}

							returnData.push({ json: { items: collected } });
							continue;
						}

						const page = this.getNodeParameter('page', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						qs = { page, pageSize };

						if (clientIdFilter) qs.clientId = clientIdFilter;
						if (clientPhone) qs.clientPhone = clientPhone;
					} else if (operation === 'getLastDialog') {
						method = 'GET';
						url = `${baseUrl}/client/dialog`;

						const clientId = this.getNodeParameter('clientId', i) as string;
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channelType = this.getNodeParameter('channelType', i) as string;

						qs = { clientId };
						if (channelId) qs.channelId = channelId;
						if (channelType) qs.channelType = channelType;
					} else if (operation === 'getDetails') {
						method = 'GET';
						const clientId = this.getNodeParameter('clientId', i) as string;
						url = `${baseUrl}/client/details/${encodeURIComponent(clientId)}`;
					} else if (operation === 'update') {
						method = 'POST';
						const clientId = this.getNodeParameter('clientId', i) as string;
						url = `${baseUrl}/client/update/${encodeURIComponent(clientId)}`;

						const name = this.getNodeParameter('name', i) as string;
						const phone = this.getNodeParameter('phone', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const additionalPayloadRaw = this.getNodeParameter('additionalPayload', i) as unknown;
						const forceAdditionalPayload = this.getNodeParameter(
							'forceAdditionalPayload',
							i,
						) as boolean;

						const formData: Record<string, string> = {};
						if (name) formData.name = name;
						if (phone) formData.phone = phone;
						if (email) formData.email = email;

						// additionalPayload приходит как объект (json param)
						if (additionalPayloadRaw && typeof additionalPayloadRaw === 'object') {
							const additionalPayload = additionalPayloadRaw as Record<string, unknown>;
							if (Object.keys(additionalPayload).length > 0) {
								formData.additional_payload = JSON.stringify(additionalPayload);
								formData.force_additional_payload = forceAdditionalPayload ? '1' : '0';
							}
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else if (operation === 'getCustomFields') {
						method = 'GET';
						const clientId = this.getNodeParameter('clientId', i) as string;
						url = `${baseUrl}/client/get-custom-fields/${encodeURIComponent(clientId)}`;
					} else if (operation === 'setCustomFields') {
						method = 'POST';
						const clientId = this.getNodeParameter('clientId', i) as string;
						url = `${baseUrl}/client/set-custom-fields/${encodeURIComponent(clientId)}`;

						const customFields = this.getNodeParameter('customFields', i) as
							| { values?: Array<{ key?: string; value?: string }> }
							| Array<{ key?: string; value?: string }>;

						// n8n fixedCollection can be returned in different shapes depending on UI/config.
						const rows = Array.isArray(customFields)
							? customFields
							: Array.isArray(customFields?.values)
								? customFields.values
								: [];

						const formData: Record<string, string> = {};
						for (const row of rows) {
							if (!row?.key) continue;
							formData[`values[${row.key}]`] = row.value ?? '';
						}

						if (Object.keys(formData).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								`No custom fields were prepared for request. customFields raw: ${JSON.stringify(customFields)}`,
								{ itemIndex: i },
							);
						}
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown client operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'dialog') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/dialogs`;

						const page = this.getNodeParameter('page', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						const status = this.getNodeParameter('status', i) as string;
						const channelId = this.getNodeParameter('channelId', i) as string;
						const channelType = this.getNodeParameter('channelType', i) as string;

						qs = { page, pageSize, status };
						if (channelId) qs.channelId = channelId;
						if (channelType) qs.channelType = channelType;
					} else if (operation === 'getDetails') {
						method = 'GET';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						url = `${baseUrl}/dialog/details/${encodeURIComponent(dialogId)}`;
					} else if (operation === 'getGroupClients') {
						method = 'GET';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						url = `${baseUrl}/dialog/group-clients/${encodeURIComponent(dialogId)}`;
					} else if (operation === 'close') {
						method = 'POST';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						url = `${baseUrl}/dialog/close/${encodeURIComponent(dialogId)}`;
					} else if (operation === 'markSeen') {
						method = 'GET';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						url = `${baseUrl}/dialog/seen/${encodeURIComponent(dialogId)}`;
					} else if (operation === 'setOperator') {
						method = 'POST';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						const operatorId = this.getNodeParameter('operatorId', i) as string;

						url = `${baseUrl}/dialog/set-operator/${encodeURIComponent(dialogId)}`;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody({ operator_id: operatorId }),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else if (operation === 'create') {
						method = 'POST';
						url = `${baseUrl}/dialog/create`;

						const channelId = this.getNodeParameter('createChannelId', i) as string;
						const clientIdentifierMode = this.getNodeParameter(
							'createClientIdentifierMode',
							i,
						) as 'phone' | 'email';

						const formData: Record<string, string> = { channelId };
						if (clientIdentifierMode === 'phone') {
							const clientPhone = this.getNodeParameter('createClientPhone', i) as string;
							if (!clientPhone?.trim()) {
								throw new NodeOperationError(this.getNode(), 'Client Phone must not be empty.', {
									itemIndex: i,
								});
							}
							formData.clientPhone = clientPhone;
						} else {
							const clientEmail = this.getNodeParameter('createClientEmail', i) as string;
							if (!clientEmail?.trim()) {
								throw new NodeOperationError(this.getNode(), 'Client Email must not be empty.', {
									itemIndex: i,
								});
							}
							formData.clientEmail = clientEmail;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else if (operation === 'markAnswered') {
						method = 'POST';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						url = `${baseUrl}/dialog/answered/${encodeURIComponent(dialogId)}`;
					} else if (operation === 'markUnanswered') {
						method = 'POST';
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						url = `${baseUrl}/dialog/unanswered/${encodeURIComponent(dialogId)}`;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown dialog operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'message') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/messages`;

						const page = this.getNodeParameter('page', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						const dialogId = this.getNodeParameter('listDialogId', i) as string;
						const channelId = this.getNodeParameter('listChannelId', i) as string;
						const clientId = this.getNodeParameter('listClientId', i) as string;

						qs = { page, pageSize };
						if (dialogId) qs.dialogId = dialogId;
						if (channelId) qs.channelId = channelId;
						if (clientId) qs.clientId = clientId;
					} else if (operation === 'send') {
						const dialogId = this.getNodeParameter('dialogId', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const attachmentMode = this.getNodeParameter('attachmentMode', i) as string;
						const repliedMessageId = this.getNodeParameter('repliedMessageId', i) as string;
						const isBinaryAttachment = ['binary', 'binaryFile', 'binary_file', 'file'].includes(
							attachmentMode,
						);
						const isUrlAttachment = ['url', 'fileUrl', 'file_url', 'link'].includes(attachmentMode);
						let binaryPropertyName: string | undefined;

						method = 'POST';
						url = `${baseUrl}/message/send`;

						// multipart/form-data
						const formData: Record<string, unknown> = {
							dialogId,
							text,
						};

						if (repliedMessageId) {
							// swagger: replied_message_id
							formData.replied_message_id = repliedMessageId;
						}

						if (isUrlAttachment) {
							const fileUrl = this.getNodeParameter('fileUrl', i) as string;
							if (fileUrl) formData.url = fileUrl;
						}

						if (isBinaryAttachment) {
							binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

							const item = items[i];
							const binary = item?.binary;

							if (!binary || !binary[binaryPropertyName]) {
								throw new NodeOperationError(
									this.getNode(),
									`Binary property "${binaryPropertyName}" is missing on item ${i}.`,
									{ itemIndex: i },
								);
							}

							const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

							const bin = binary[binaryPropertyName];
							const filename = bin.fileName || 'attachment';
							const contentType = bin.mimeType || 'application/octet-stream';

							formData.file = {
								value: buffer,
								options: { filename, contentType },
							};
						}

						let response;
						if (isBinaryAttachment) {
							const { fields, file } = extractMultipartParts(formData);
							response = await sendMultipartRequest(url, creds.token, fields, file);
						} else {
							response = await this.helpers.httpRequestWithAuthentication.call(this, 'teletypeApi', {
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							});
						}

						returnData.push({ json: response });
						continue;
					} else if (operation === 'sendMessage') {
						method = 'POST';
						url = `${baseUrl}/channel/send-message`;

						const channelId = this.getNodeParameter('sendChannelId', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const autoClose = this.getNodeParameter('autoClose', i) as boolean;
						const recipientMode = this.getNodeParameter('recipientMode', i) as string;
						const attachmentMode = this.getNodeParameter('attachmentMode', i) as string;
						const repliedMessageId = this.getNodeParameter('repliedMessageId', i) as string;
						const isBinaryAttachment = ['binary', 'binaryFile', 'binary_file', 'file'].includes(
							attachmentMode,
						);
						const isUrlAttachment = ['url', 'fileUrl', 'file_url', 'link'].includes(attachmentMode);
						let binaryPropertyName: string | undefined;

						const formData: Record<string, unknown> = {
							channelId,
							text,
							autoClose,
						};

						if (repliedMessageId) {
							formData.replied_message_id = repliedMessageId;
						}

						if (recipientMode === 'phone') {
							const clientPhone = this.getNodeParameter('clientPhone', i) as string;
							if (clientPhone) formData.clientPhone = clientPhone;
						} else if (recipientMode === 'email') {
							const clientEmail = this.getNodeParameter('clientEmail', i) as string;
							if (clientEmail) formData.clientEmail = clientEmail;
						} else if (recipientMode === 'username') {
							const clientUsername = this.getNodeParameter('clientUsername', i) as string;
							if (clientUsername) formData.clientUsername = clientUsername;
						}

						if (isUrlAttachment) {
							const fileUrl = this.getNodeParameter('fileUrl', i) as string;
							if (fileUrl) formData.url = fileUrl;
						}

						if (isBinaryAttachment) {
							binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
							const item = items[i];
							const binary = item?.binary;

							if (!binary || !binary[binaryPropertyName]) {
								throw new NodeOperationError(
									this.getNode(),
									`Binary property "${binaryPropertyName}" is missing on item ${i}.`,
									{ itemIndex: i },
								);
							}

							const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							const bin = binary[binaryPropertyName];
							const filename = bin.fileName || 'attachment';
							const contentType = bin.mimeType || 'application/octet-stream';

							formData.file = {
								value: buffer,
								options: { filename, contentType },
							};
						}

						let response;
						if (isBinaryAttachment) {
							const { fields, file } = extractMultipartParts(formData);
							response = await sendMultipartRequest(url, creds.token, fields, file);
						} else {
							response = await this.helpers.httpRequestWithAuthentication.call(this, 'teletypeApi', {
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							});
						}

						returnData.push({ json: response });
						continue;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown message operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'channel') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/channels`;

						const page = this.getNodeParameter('page', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						const channelType = this.getNodeParameter('channelType', i) as string;
						const onlyActive = this.getNodeParameter('onlyActive', i) as boolean;

						qs = { page, pageSize, onlyActive };
						if (channelType) qs.channelType = channelType;
					} else if (operation === 'sendMessage') {
						method = 'POST';
						url = `${baseUrl}/channel/send-message`;

						const channelId = this.getNodeParameter('sendChannelId', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const autoClose = this.getNodeParameter('autoClose', i) as boolean;
						const recipientMode = this.getNodeParameter('recipientMode', i) as string;
						const attachmentMode = this.getNodeParameter('attachmentMode', i) as string;
						const repliedMessageId = this.getNodeParameter('repliedMessageId', i) as string;
						const isBinaryAttachment = ['binary', 'binaryFile', 'binary_file', 'file'].includes(
							attachmentMode,
						);
						const isUrlAttachment = ['url', 'fileUrl', 'file_url', 'link'].includes(attachmentMode);
						let binaryPropertyName: string | undefined;

						const formData: Record<string, unknown> = {
							channelId,
							text,
							autoClose,
						};

						if (repliedMessageId) {
							formData.replied_message_id = repliedMessageId;
						}

						if (recipientMode === 'phone') {
							const clientPhone = this.getNodeParameter('clientPhone', i) as string;
							if (clientPhone) formData.clientPhone = clientPhone;
						} else if (recipientMode === 'email') {
							const clientEmail = this.getNodeParameter('clientEmail', i) as string;
							if (clientEmail) formData.clientEmail = clientEmail;
						} else if (recipientMode === 'username') {
							const clientUsername = this.getNodeParameter('clientUsername', i) as string;
							if (clientUsername) formData.clientUsername = clientUsername;
						}

						if (isUrlAttachment) {
							const fileUrl = this.getNodeParameter('fileUrl', i) as string;
							if (fileUrl) formData.url = fileUrl;
						}

						if (isBinaryAttachment) {
							binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

							const item = items[i];
							const binary = item?.binary;

							if (!binary || !binary[binaryPropertyName]) {
								throw new NodeOperationError(
									this.getNode(),
									`Binary property "${binaryPropertyName}" is missing on item ${i}.`,
									{ itemIndex: i },
								);
							}

							const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
							const bin = binary[binaryPropertyName];
							const filename = bin.fileName || 'attachment';
							const contentType = bin.mimeType || 'application/octet-stream';

							formData.file = {
								value: buffer,
								options: { filename, contentType },
							};
						}

						let response;
						if (isBinaryAttachment) {
							const { fields, file } = extractMultipartParts(formData);
							response = await sendMultipartRequest(url, creds.token, fields, file);
						} else {
							response = await this.helpers.httpRequestWithAuthentication.call(this, 'teletypeApi', {
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							});
						}

						returnData.push({ json: response });
						continue;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown channel operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'tag') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/tag/list`;
					} else if (operation === 'addToClient' || operation === 'removeFromClient') {
						method = 'POST';

						const clientId = this.getNodeParameter('clientId', i) as string;
						const tagId = this.getNodeParameter('tagId', i) as string;

						url =
							operation === 'addToClient'
								? `${baseUrl}/client/add-tag/${encodeURIComponent(clientId)}`
								: `${baseUrl}/client/remove-tag/${encodeURIComponent(clientId)}`;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody({ tag_id: tagId }),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown tag operation "${operation}".`, {
							itemIndex: i,
						});
					}
				} else if (resource === 'category') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/appeal-categories/list`;
					} else if (operation === 'setForDialog') {
						method = 'POST';

						const dialogId = this.getNodeParameter('dialogId', i) as string;
						const categoryId = this.getNodeParameter('categoryId', i) as string;

						url = `${baseUrl}/dialog/set-category/${encodeURIComponent(dialogId)}`;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody({ category_appointed_id: categoryId }),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown category operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'note') {
					if (operation === 'list') {
						method = 'GET';
						const clientId = this.getNodeParameter('clientId', i) as string;
						url = `${baseUrl}/client/notes-list/${encodeURIComponent(clientId)}`;
					} else if (operation === 'create') {
						method = 'POST';

						const clientId = this.getNodeParameter('clientId', i) as string;
						const text = this.getNodeParameter('text', i) as string;

						url = `${baseUrl}/client/create-note/${encodeURIComponent(clientId)}`;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody({ text }),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else if (operation === 'delete') {
						method = 'GET';
						const noteId = this.getNodeParameter('noteId', i) as string;
						url = `${baseUrl}/client/delete-note/${encodeURIComponent(noteId)}`;
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown note operation "${operation}".`, {
							itemIndex: i,
						});
					}
				} else if (resource === 'template') {
					if (operation === 'list') {
						method = 'GET';
						url = `${baseUrl}/template-message/list`;
					} else if (operation === 'listDirectories') {
						method = 'GET';
						url = `${baseUrl}/template-message/directories`;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown template operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'project') {
					if (operation === 'getBalance') {
						method = 'GET';
						url = `${baseUrl}/project/balance`;
					} else if (operation === 'getOperators') {
						method = 'GET';
						url = `${baseUrl}/project/operators`;
					} else if (operation === 'getApiStatus') {
						method = 'GET';
						url = `${baseUrl}/project/api-status`;
					} else if (operation === 'getDetails') {
						method = 'GET';
						url = `${baseUrl}/project/details`;
					} else if (operation === 'getTariff') {
						method = 'GET';
						url = `${baseUrl}/project/tariff`;
					} else if (operation === 'updatePublicApi') {
						method = 'POST';
						url = `${baseUrl}/project/update-public-api`;

						const apiWebhook = this.getNodeParameter('apiWebhook', i) as string;
						const activeWebhooks = this.getNodeParameter('activeWebhooks', i) as string[];

						const formData: Record<string, unknown> = {};
						if (Array.isArray(activeWebhooks) && activeWebhooks.length)
							formData['active_webhooks[]'] = activeWebhooks;
						if (apiWebhook) formData.api_webhook = apiWebhook;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'teletypeApi',
							{
								method: 'POST',
								url,
								body: toUrlEncodedBody(formData),
								json: true,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
								},
							},
						);

						returnData.push({ json: response });
						continue;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown project operation "${operation}".`,
							{ itemIndex: i },
						);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource "${resource}".`, {
						itemIndex: i,
					});
				}

				const options = {
					method,
					url,
					qs,
					json: true,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'teletypeApi',
					options,
				);

				returnData.push({ json: response });
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: message, resource, operation } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

