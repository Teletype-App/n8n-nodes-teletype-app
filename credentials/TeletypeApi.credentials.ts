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
		{
			displayName: 'Auth Mode',
			name: 'authMode',
			type: 'options',
			options: [
				{ name: 'Header (X-Auth-Token)', value: 'header' },
				{ name: 'Query (?token=...)', value: 'query' },
			],
			default: 'header',
			description: 'How to send the token to Teletype API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				// Если authMode=header — кладём токен в X-Auth-Token
				'X-Auth-Token': '={{$credentials.authMode === "header" ? $credentials.token : undefined}}',
			},
			qs: {
				// Если authMode=query — кладём токен в ?token=
				token: '={{$credentials.authMode === "query" ? $credentials.token : undefined}}',
			},
		},
	};

	// ✅ Лучший тест: получить детали проекта по токену
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/project/details',
			method: 'GET',
		},
	};
}