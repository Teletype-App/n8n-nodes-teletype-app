import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon
} from 'n8n-workflow';

export class TeletypeApi implements ICredentialType {
	name = 'teletypeApi';
	displayName = 'Teletype API';
	icon: Icon = 'file:../icons/teletype.svg';
	documentationUrl = 'https://teletype.app/help/api/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.teletype.app/public/api/v1',
			description: 'Teletype Public API base URL',
		},
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Project token from Teletype (Public API)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Auth-Token': '={{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/project/details',
			method: 'GET',
		},
	};
}
