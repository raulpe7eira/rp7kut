import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
	if (request.method === 'POST') {
		const TOKEN = '307e98bf6f8fc0d31a55548f6c62bb';
		const client = new SiteClient(TOKEN);

		// Validar os dados, antes de sair cadastrando
		const registroCriado = await client.items.create({
			itemType: "973333", // ID do Model de "Communities" criado pelo Dato
			...request.body,
		})

		console.log(registroCriado);

		response.json({
			dados: 'Algum dado qualquer',
			registroCriado: registroCriado,
		})
		return;
	}

	response.status(404).json({
		message: 'Ainda não temos nada no GET, mas no POST tem!'
	})
}
