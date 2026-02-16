import type { Page } from '~/types/config'
import { useAuthManager } from '@/stores/auth-manager'

export const Logout = ref<Page>({
	title: 'Çıkış Yap',
	uid: 'logout',
	action: async () => await useAuthManager().logout(),
	icon: 'material-symbols:logout-rounded',
})
