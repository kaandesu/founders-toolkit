import type { Page } from '~/types/config'
export const Explore = ref<Page>({
	title: 'Explore',
	uid: 'explore',
	label: '',
	href: '/explore',
	icon: 'material-symbols:person',
	isCollapsed: true,
	hideTitle: true,
	tourDesc: 'Explore new people',
	layout: 'dashboard-page',
})
