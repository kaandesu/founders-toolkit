import { defineStore } from 'pinia'

interface ApiResponseGeneric<T> {
	data: T | null
	message: string
}

const apiBaseUrl = 'https://founders-api-test.yomuhoudai.club'
// const apiBaseUrl = 'http://localhost:8313'

export type UserAccount = {
	email: string
	full_name: string
}

type Callbacks = {
	onSuccess?: (data?: any) => any
	onError?: (error?: any) => any
}

export const useAuthManager = defineStore(
	'AuthManager',
	() => {
		const loading = ref(false)
		const initialized = ref(false)
		const isAuthenticated = computed(() => !!accessToken.value)

		const currentActiveDevice = ref<string>('İnternet Tarayıcısı')

		const accessToken = ref<string>('')
		const refreshToken = ref<string>('')

		const API = async (fn: () => Promise<any>) => {
			try {
				return await fn()
			} catch (e: any) {
				if (e?.statusCode === 401) {
					const refreshed = await refreshAccessToken()
					if (refreshed) {
						return await fn()
					}
					throw e
				}
				throw e
			}
		}

		const userAccount = ref<UserAccount>({
			email: '',
			full_name: '',
		})

		const signUp = ({
			email,
			password,
			onSuccess,
			onError,
		}: {
			email: string
			password: string
		} & Callbacks) => {
			const fetcher = $fetch.create({
				baseURL: apiBaseUrl,
				onResponse({ response }) {
					if (!response.ok) return
					createToast({
						message: 'Kayıt başarılı',
						toastOps: {
							description: 'Hesabınız başarıyla oluşturuldu.',
						},
						type: 'success',
					})()
					if (onSuccess) onSuccess(response._data)
				},
				onResponseError({ response }) {
					createToast({
						message: 'Kayıt başarısız',
						toastOps: {
							description:
								response._data?.message ??
								'Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.',
						},
						type: 'error',
					})()
					if (onError) onError(response._data)
				},
			})

			return fetcher<ApiResponseGeneric<any>>('/auth/signup', {
				method: 'POST',
				body: {
					email,
					password,
				},
			})
		}

		const signIn = ({
			identifier,
			password,
			onSuccess,
			onError,
		}: {
			identifier: string
			password: string
		} & Callbacks) => {
			const fetcher = $fetch.create({
				baseURL: apiBaseUrl,
				onResponse({ response }) {
					if (!response.ok) return

					const { access_token, refresh_token, email, full_name } =
						response._data.data
					accessToken.value = access_token

					let temp: UserAccount = {
						email,
						full_name,
					}
					userAccount.value = temp

					if (refresh_token) refreshToken.value = refresh_token

					createToast({
						message: 'Login successful',
						type: 'success',
					})()

					if (onSuccess) onSuccess(response._data)
				},
				onResponseError({ response }) {
					createToast({
						message: 'Login failed',
						toastOps: {
							description: response._data?.message ?? 'error',
						},
						type: 'error',
					})()
					if (onError) onError(response._data)
				},
			})

			return fetcher<ApiResponseGeneric<any>>('/auth/login', {
				method: 'POST',
				body: {
					email: identifier,
					password: password,
				},
			})
		}

		const refreshAccessToken = ({
			onSuccess,
			onError,
		}: Callbacks = {}): Promise<boolean> => {
			if (!refreshToken.value) {
				if (onError) onError({ message: 'No refresh token available' })
				return Promise.resolve(false)
			}

			return new Promise((resolve) => {
				const fetcher = $fetch.create({
					baseURL: apiBaseUrl,
					onResponse({ response }) {
						if (!response.ok) {
							resolve(false)
							return
						}

						const {
							access_token,
							refresh_token,
							email,
							role,
							full_name,
						} = response._data.data

						if (access_token) {
							accessToken.value = access_token

							let temp: UserAccount = {
								email,
								full_name,
							}
							userAccount.value = temp

							if (refresh_token)
								refreshToken.value = refresh_token

							if (onSuccess) onSuccess(response._data)
							resolve(true)
							return
						}

						logout()
						if (onError) onError(response._data)
						resolve(false)
					},
					onResponseError({ response }) {
						createToast({
							message: 'Oturumun Süresi Doldu',
							toastOps: {
								description:
									response._data?.message ?? 'Unauthorized',
							},
							type: 'error',
						})()
						logout()
						if (onError) onError(response._data)
						resolve(false)
					},
				})

				fetcher<ApiResponseGeneric<any>>('/auth/refresh-old', {
					method: 'POST',
					body: { refresh_token: refreshToken.value },
				})
			})
		}

		const added = ref([])

		const logout = async () => {
			const fetcher = $fetch.create({
				baseURL: apiBaseUrl,
				onResponse({ response }) {
					if (!response.ok) return

					accessToken.value = ''
					refreshToken.value = ''
					userAccount.value = {
						email: '',
						full_name: '',
					}
					navigateTo('/auth/login')
				},
				onResponseError({ response }) {
					if (response.status === 401) return
				},
			})

			return fetcher('/auth/logout', {
				method: 'POST',
				body: {
					refresh_token: refreshToken.value,
				},
			})
		}

		const ChangePassword = ({
			current_password,
			new_password,
		}: {
			current_password: string
			new_password: string
		}): Promise<ApiResponseGeneric<any>> => {
			const fetcher = $fetch.create({
				baseURL: apiBaseUrl,
				onResponse({ response }) {
					if (!response.ok) return
					createToast({
						message: 'Şifreniz başarıyla değiştirildi!',
						type: 'success',
					})()
				},
				onResponseError({ response }) {
					if (response.status !== 401) {
						createToast({
							message: 'Hata: Şifreniz değiştirilemedi!',
							toastOps: {
								description:
									response._data?.message ??
									'Şifreniz değiştirilemedi!',
							},
							type: 'error',
						})()
					}
				},
			})
			return fetcher<ApiResponseGeneric<any>>('/auth/change-password', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken?.value ?? ''}`,
				},
				body: {
					current_password,
					new_password,
				},
			})
		}

		return {
			loading,
			accessToken,
			refreshToken,
			initialized,
			isAuthenticated,
			userAccount,
			signIn,
			signUp,
			refreshAccessToken,
			ChangePassword,
			currentActiveDevice,
			logout,
			API,
			added,
		}
	},
	{
		persist: {
			pick: ['refreshToken', 'userAccount'],
		},
	},
)
