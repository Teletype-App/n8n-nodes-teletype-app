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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class Teletype implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teletype',
		name: 'teletype',
		icon: 'file:../../icons/teletype.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Work with Teletype Public API',
		defaults: {
			name: 'Teletype',
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
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Client', value: 'client' },
					{ name: 'Dialog', value: 'dialog' },
					{ name: 'Message', value: 'message' },
				],
				default: 'client',
			},
			...clientsDescription,
			...dialogsDescription,
			...messagesDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const creds = await this.getCredentials<{ baseUrl: string }>('teletypeApi');
		const baseUrl = (creds.baseUrl || 'https://api.teletype.app/public/api/v1').replace(/\/+$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				let method: HttpMethod = 'GET';
				let url = '';
				let qs: Record<string, string | number | boolean> | undefined;

				if (resource === 'client') {
					if (operation === 'getCustomFields') {
						const clientId = this.getNodeParameter('clientId', i) as string;
						method = 'GET';
						url = `${baseUrl}/client/get-custom-fields/${encodeURIComponent(clientId)}`;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Operation "${operation}" for resource "client" is not implemented yet.`,
							{ itemIndex: i },
						);
					}
				} else if (resource === 'dialog') {
					throw new NodeOperationError(
						this.getNode(),
						'Resource "dialog" is not implemented yet. Add real endpoints from Swagger.',
						{ itemIndex: i },
					);
				} else if (resource === 'message') {
					throw new NodeOperationError(
						this.getNode(),
						'Resource "message" is not implemented yet. Add real endpoints from Swagger.',
						{ itemIndex: i },
					);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource "${resource}".`, { itemIndex: i });
				}

				const options = {
					method,
					url,
					qs,
					json: true,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'teletypeApi', options);

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