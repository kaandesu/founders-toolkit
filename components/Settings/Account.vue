<template>
	<div class="hidden lg:block">
		<h3 class="text-lg font-medium">Account Settings</h3>
		<p class="text-sm text-muted-foreground">
			Manage your user information and security settings. You can change
			your password and configure your account preferences here.
		</p>
	</div>
	<Separator class="my-4 hidden lg:block" />
	<div class="flex w-full flex-col items-start space-y-4 pb-8 text-lg">
		<Card class="w-auto py-0">
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>
					Enter your current password and your new password twice to
					change your password.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<!-- Current Password -->
				<div class="relative space-y-1">
					<Label for="current_password">Current Password</Label>
					<div class="relative flex">
						<Input
							id="current_password"
							:type="showPasswordText1 ? 'text' : 'password'"
							placeholder="Enter your current password"
							v-model="currentPassword"
							class="w-full pr-10"
						/>
						<button
							type="button"
							@click="showPasswordText1 = !showPasswordText1"
							class="inset-y-0 ml-2 flex items-center"
						>
							<Icon
								:name="
									showPasswordText1
										? 'ri:eye-off-line'
										: 'ri:eye-line'
								"
								size="1.2rem"
							/>
						</button>
					</div>
				</div>

				<!-- New Password -->
				<div class="relative space-y-1">
					<Label for="new_password">New Password</Label>
					<div class="flex">
						<Input
							id="new_password"
							:type="showPasswordText2 ? 'text' : 'password'"
							placeholder="Enter your new password"
							v-model="newPassword"
							class="w-full pr-10"
						/>
						<button
							type="button"
							@click="showPasswordText2 = !showPasswordText2"
							class="inset-y-0 ml-2 flex items-center"
						>
							<Icon
								:name="
									showPasswordText2
										? 'ri:eye-off-line'
										: 'ri:eye-line'
								"
								size="1.2rem"
							/>
						</button>
					</div>
				</div>

				<!-- Confirm New Password -->
				<div class="relative space-y-1">
					<Label for="confirm_password">New Password (Confirm)</Label>
					<div class="relative flex">
						<Input
							id="confirm_password"
							:type="showPasswordText3 ? 'text' : 'password'"
							placeholder="Re-enter your new password"
							v-model="confirmPassword"
							class="w-full pr-10"
						/>
						<button
							type="button"
							@click="showPasswordText3 = !showPasswordText3"
							class="inset-y-0 ml-2 flex items-center"
						>
							<Icon
								:name="
									showPasswordText3
										? 'ri:eye-off-line'
										: 'ri:eye-line'
								"
								size="1.2rem"
							/>
						</button>
					</div>
					<p
						v-if="confirmPassword && !passwordsMatch"
						class="text-sm text-red-500"
					>
						New passwords do not match
					</p>
				</div>

				<CardFooter class="mt-6 p-0">
					<Button
						@click.prevent="onSubmit"
						:disabled="!canSubmit"
						variant="default"
						class="box-border rounded-lg text-lg"
					>
						Save Password
						<Icon
							class="ml-2"
							size="1.25rem"
							name="ri:save-3-fill"
						/>
					</Button>
				</CardFooter>
			</CardContent>
		</Card>

		<Alert
			variant="destructive"
			class="mt-4 box-border max-w-xl opacity-65"
		>
			<AlertCircle class="h-4 w-4" />
			<AlertTitle>Account Deletion Request</AlertTitle>
			<AlertDescription>
				If you would like your account and all your data to be deleted,
				please
				<a
					href="https://github.com/kaandesu"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline dark:text-amber-500"
				>
					contact
				</a>
				. After your request is received, your data will be deleted
				within 72 hours.
			</AlertDescription>
		</Alert>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showPasswordText1 = ref(false)
const showPasswordText2 = ref(false)
const showPasswordText3 = ref(false)

const passwordsMatch = computed(
	() => newPassword.value === confirmPassword.value,
)

const canSubmit = computed(
	() =>
		currentPassword.value.length >= 4 &&
		newPassword.value.length >= 4 &&
		confirmPassword.value.length >= 4 &&
		passwordsMatch.value,
)

const { API } = useAuthManager()
const auth = useAuthManager()
const { ChangePassword } = auth

const onSubmit = async () => {
	await API(() =>
		ChangePassword({
			current_password: currentPassword.value,
			new_password: newPassword.value,
		}),
	)
}
</script>
