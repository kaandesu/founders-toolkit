<template>
	<div class="hidden lg:block">
		<h3 class="text-lg font-medium">Appearance</h3>
		<p class="text-sm text-muted-foreground">
			Customize the appearance of the application. Automatically switch
			between day and night themes.
		</p>
	</div>
	<Separator class="mb-4 hidden lg:block" />
	<div class="flex flex-col items-start space-y-4 text-lg">
		<div class="flex w-full items-center justify-start space-x-2">
			<Label class="mr-4 text-lg">Select the application theme:</Label>
			<Button
				class="box-border rounded-lg"
				id="theme-switch"
				:variant="colorMode.value === 'dark' ? 'default' : 'outline'"
				@click="handleClick()"
			>
				<Label
					class="pointer-events-none mr-4 text-lg"
					for="theme-switch"
				>
					{{
						colorMode.value === 'dark'
							? 'Dark Theme'
							: 'Light Theme'
					}}
				</Label>
				<Icon
					v-if="colorMode.value === 'dark'"
					name="line-md:moon-to-sunny-outline-transition"
					size="1.5rem"
				/>
				<Icon
					v-else
					name="line-md:sunny-outline-to-moon-transition"
					size="1.5rem"
				/>
			</Button>
		</div>

		<div
			v-if="false"
			class="flex w-full items-center justify-start space-x-2"
		>
			<Label class="mr-4 text-lg"
				>Select the main color of the application:</Label
			>
			<theme-select />
		</div>
	</div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const handleClick = () => {
	colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}
</script>
