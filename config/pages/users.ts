import type { Page } from '~/types/config'
export const Users = ref<Page>({
	title: 'Network',
	uid: 'network',
	label: '',
	href: '/network',
	icon: 'ci:users',
	isCollapsed: true,
	tourDesc: 'View your your co-founder network',
	sidebarSeperator: true,
	layout: 'dashboard-page',
})
