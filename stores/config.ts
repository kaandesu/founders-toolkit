import { defineStore } from 'pinia'
import type { DashboardConfig } from '../types/config'
import type { AuthenticationStructure } from '../types/config'
import { pagesDict as p } from '../config/pages'

export type FederatedAuthProviderOptions = 'google' | 'github'

export const useConfigStore = defineStore(
	'ConfigStore',
	() => {
		const structureRef = ref<{ authentication: AuthenticationStructure }>({
			authentication: {
				custom: true,
				providers: [],
				tosAndPrivacy: {
					required: true,
					tos: 'https://github.com/kaandesu/',
					privacy: 'https://github.com/kaandesu/',
				},
				mfa: true,
			},
		})

		// TODO: maybe runtime config this
		// the pages are meant to be on the sidebar
		// should be generated
		const sidebar = ref<DashboardConfig>({
			title: 'FoundMe',
			desc: 'Found your Co-founder',
			logo: 'https://github.com/kaandesu/testrepo/blob/main/WhatsApp%20Image%202026-02-16%20at%2015.38.40.jpeg?raw=true',
			logoFallback: 'K',
			pages: [
				p.Explore.value,
				p.Profile.value,
				p.LookingFor.value,
				p.Chats.value,
				// p.Apps.value,
				p.Users.value,
				p.Settings.value,
			],
		})

		const structure = readonly(structureRef)

		return {
			sidebar,
			structure,
		}
	},
	{
		persist: [
			{
				pick: ['dashboard'],
				storage: sessionStorage,
			},
		],
	},
)
