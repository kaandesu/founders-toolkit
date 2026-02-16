<template>
	<main class="flex bg-background">
		<sidebar2
			v-model:collapsed="navState.collapsed"
			v-model:open="navState.open"
		/>
		<main
			class="mt-16 flex h-screen w-full transition-[margin] md:mt-0"
			:class="navState.collapsed ? 'md:ml-[3.7rem]' : 'md:ml-[15.15rem]'"
		>
			<div class="flex h-full w-full flex-col">
				<!-- Page  -->
				<section class="box-border h-[calc(100%-4rem)] w-full p-6 pt-2">
					<div
						v-if="!currentPageInfo.hideTitle"
						class="text-3xl font-bold"
					>
						{{ currentPageInfo.title }}
					</div>
					<div v-auto-animate class="pb-2">
						<p v-if="currentPageInfo.desc">
							{{ currentPageInfo.desc }}
							<br />
						</p>
					</div>
					<slot />
				</section>
			</div>
		</main>
	</main>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@/stores/app-state'
const { navState, currentPageInfo } = storeToRefs(useAppStateStore())
</script>
