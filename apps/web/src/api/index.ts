import config from 'app-config.json'

export type CreateWorkshopPayload = {
	name: string
	dollarLimit: number
	players: Array<{
		nickname: string
		tags: string[]
		wishlist: string[]
	}>
}

export const createWorkshop = async (
	payload: CreateWorkshopPayload,
): Promise<any> => {
	const response = await fetch(`${config.api}/workshop/create`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})

	if (!response.ok) {
		const error = await response.json().catch(() => null)
		throw new Error(
			error ? `Failed to create workshop: ${JSON.stringify(error)}` : 'Failed to create workshop',
		)
	}

	return response.json()
}

export const getWorkshopByCode = async (code: string): Promise<any> => {
	const response = await fetch(`${config.api}/workshop/${code}`, {
		method: 'GET',
	})

	if (!response.ok) {
		throw new Error('Workshop not found. Please check the code and try again.')
	}

	return response.json()
}
