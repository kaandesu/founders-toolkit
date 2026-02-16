import type { Page } from '~/types/config'
export const Profile = ref<Page>({
	title: 'Profile',
	uid: 'profile',
	label: '',
	href: '/profile',
	icon: 'material-symbols:person',
	isCollapsed: true,
	tourDesc: 'View and edit your data',
	layout: 'dashboard-page',
})
