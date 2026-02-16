/* AUTO-GENERATED FILE - DO NOT EDIT */
import type { Page } from '~/types/config'

import { Authentication } from './authentication'
import { ChangePassword } from './changePassword'
import { Explore } from './explore'
import { LookingFor } from './looking-for'
import { Chats } from './chats'
import { Customers } from './customers'
import { Dashboard } from './dashboard'
import { DashboardSettings } from './dashboardSettings'
import { ForgotPassword } from './forgotPassword'
import { NotFound } from './notFound'
import { Settings } from './settings'
import { SignIn } from './signIn'
import { SignUp } from './signUp'
import { Users } from './users'
import { Profile } from './profile'

export type PageId =
	| 'authentication'
	| 'change-password'
	| 'looking-for'
	| 'chats'
	| 'profile'
	| 'customers'
	| 'explore'
	| 'dashboard'
	| 'dashboard-settings'
	| 'forgot-password'
	| 'not-found'
	| 'settings'
	| 'sign-in'
	| 'sign-up'
	| 'users'

export const pages: Page[] = [
	Authentication.value,
	Explore.value,
	ChangePassword.value,
	Profile.value,
	LookingFor.value,
	Chats.value,
	Customers.value,
	Dashboard.value,
	DashboardSettings.value,
	ForgotPassword.value,
	NotFound.value,
	Settings.value,
	SignIn.value,
	SignUp.value,
	Users.value,
]

export const pagesDict: Record<string, Ref<Page>> = {
	Authentication,
	ChangePassword,
	Explore,
	Profile,
	Chats,
	Customers,
	Dashboard,
	DashboardSettings,
	LookingFor,
	ForgotPassword,
	NotFound,
	Settings,
	SignIn,
	SignUp,
	Users,
}
