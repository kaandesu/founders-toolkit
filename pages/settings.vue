<template>
	<main class="flex h-full w-full">
		<Tabs
			default-value="account"
			class="flex h-full w-full flex-col items-start justify-start pt-0 lg:flex-row"
			orientation="vertical"
		>
			<TabsList
				class="mb-2 mt-0 box-border flex h-12 flex-row justify-start gap-2 rounded-none bg-background bg-none py-0 pt-2 shadow-none dark:bg-background md:w-48 lg:mb-0 lg:h-[6.1rem] lg:w-64 lg:flex-col"
			>
				<TabsTrigger
					:value="opt.value"
					v-for="(opt, i) in [
						{ value: 'account', label: 'Account Settings' },
						{ value: 'apperance', label: 'Apperance' },
					]"
					:key="i"
					class="box-border flex w-full justify-start bg-secondary text-left text-lg data-[state=active]:bg-primary data-[state=active]:text-white"
				>
					{{ opt.label }}
				</TabsTrigger>
			</TabsList>

			<div class="flex-1 p-4 pt-0">
				<TabsContent class="mt-0" value="account">
					<SettingsAccount />
				</TabsContent>

				<TabsContent value="apperance">
					<SettingsApperance />
				</TabsContent>
			</div>
		</Tabs>
	</main>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'dashboard-page',
})
</script>
