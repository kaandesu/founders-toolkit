<template>
	<main class="h-full w-full overflow-auto p-0">
		<form
			@submit.prevent="onSubmit"
			class="grid grid-cols-1 gap-8 md:grid-cols-2"
		>
			<!-- Left column: Form fields -->
			<div class="space-y-6">
				<!-- B1: Co-founder role needed -->
				<section class="space-y-2">
					<h2 class="font-semibold">
						Co-founder Role Needed (primary)
					</h2>
					<select v-model="preferences2.roleNeeded" class="input">
						<option value="">Select role</option>
						<option value="tech">Tech</option>
						<option value="business">Business</option>
						<option value="product">Product</option>
						<option value="sales">Sales/Growth</option>
						<option value="ops">Ops/Finance</option>
					</select>
				</section>

				<!-- B2: Role radar desired -->
				<section class="space-y-2">
					<h2 class="font-semibold">Role Radar Desired (0–10)</h2>
					<div
						v-for="axis in radarAxes"
						:key="axis.key"
						class="flex items-center space-x-4"
					>
						<label class="w-24">{{ axis.label }}</label>
						<input
							type="range"
							min="0"
							max="10"
							v-model.number="preferences2.radar[axis.key]"
							class="flex-1"
						/>
						<span>{{ preferences2.radar[axis.key] }}</span>
					</div>
				</section>

				<!-- B3: Stage preference -->
				<section class="space-y-2">
					<h2 class="font-semibold">Stage Preference</h2>
					<select v-model="preferences2.stage" class="input">
						<option value="">Select stage</option>
						<option value="idea">Idea</option>
						<option value="mvp">MVP</option>
						<option value="early">Early revenue</option>
						<option value="scaling">Scaling</option>
					</select>
				</section>

				<!-- B4: Commitment + location -->
				<section class="space-y-2">
					<h2 class="font-semibold">Commitment + Location</h2>
					<select v-model="preferences2.commitment" class="input">
						<option value="">Full-time vs Part-time</option>
						<option value="full-time">Full-time</option>
						<option value="part-time">Part-time</option>
					</select>
					<select v-model="preferences2.location" class="input">
						<option value="">Remote / City / Relocate</option>
						<option value="remote">Remote</option>
						<option value="sameCity">Same city</option>
						<option value="relocate">Open to relocate</option>
					</select>
				</section>

				<!-- B5: Must-have hard skills -->
				<section class="space-y-2">
					<h2 class="font-semibold">Must-have Hard Skills (top 5)</h2>
					<TagsInput
						v-model="preferences2.hardSkills"
						class="box-border w-full"
					>
						<TagsInputItem
							v-for="item in preferences2.hardSkills"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput placeholder="Python, React, AI..." />
					</TagsInput>
				</section>

				<!-- B6: Must-have soft traits -->
				<section class="space-y-2">
					<h2 class="font-semibold">Must-have Soft Traits (top 5)</h2>
					<TagsInput
						v-model="preferences2.softTraits"
						class="box-border w-full"
					>
						<TagsInputItem
							v-for="item in preferences2.softTraits"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput
							placeholder="Leadership, communication..."
						/>
					</TagsInput>
				</section>

				<!-- B7: Industry / domain interest -->
				<section class="space-y-2">
					<h2 class="font-semibold">Industry / Domain Interest</h2>
					<TagsInput
						v-model="preferences2.industries"
						class="box-border w-full"
					>
						<TagsInputItem
							v-for="item in preferences2.industries"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput placeholder="SaaS, fintech, AI..." />
					</TagsInput>
				</section>

				<!-- B8: Values / dealbreakers -->
				<section class="space-y-2">
					<h2 class="font-semibold">Values / Dealbreakers</h2>
					<div class="grid grid-cols-2 gap-4">
						<select
							v-model="preferences2.riskTolerance"
							class="input"
						>
							<option value="">Risk tolerance</option>
							<option value="low">Low</option>
							<option value="med">Medium</option>
							<option value="high">High</option>
						</select>
						<select v-model="preferences2.speed" class="input">
							<option value="">Speed</option>
							<option value="fast">Fast iterations</option>
							<option value="careful">Careful planning</option>
						</select>
						<select
							v-model="preferences2.decisionStyle"
							class="input"
						>
							<option value="">Decision style</option>
							<option value="founder-led">Founder-led</option>
							<option value="consensus">Consensus</option>
						</select>
						<select
							v-model="preferences2.equityPhilosophy"
							class="input"
						>
							<option value="">Equity philosophy</option>
							<option value="equal">Equal</option>
							<option value="merit">Merit-based</option>
						</select>
					</div>
				</section>

				<button type="submit" class="btn btn-primary mt-4 w-full">
					Update preferences2
				</button>
			</div>
		</form>
	</main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
	TagsInput,
	TagsInputInput,
	TagsInputItem,
	TagsInputItemDelete,
	TagsInputItemText,
} from '@/components/ui/tags-input'

definePageMeta({ layout: 'dashboard-page' })

const radarAxes = [
	{ key: 'tech', label: 'Tech' },
	{ key: 'business', label: 'Business' },
	{ key: 'product', label: 'Product' },
	{ key: 'sales', label: 'Sales/Growth' },
	{ key: 'ops', label: 'Ops/Finance' },
]

const accountStore = useAccountStore()
const { preferences } = storeToRefs(accountStore)

const preferences2 = ref({
	roleNeeded: '',
	radar: {
		tech: 0,
		business: 0,
		product: 0,
		sales: 0,
		ops: 0,
	},
	stage: '',
	commitment: '',
	location: '',
	hardSkills: [] as string[],
	softTraits: [] as string[],
	industries: [] as string[],
	riskTolerance: '',
	speed: '',
	decisionStyle: '',
	equityPhilosophy: '',
})

onMounted(() => {
	preferences2.value = preferences.value
})

const update = () => (preferences.value = preferences2.value)

const onSubmit = () => {
	update()
	console.log('Preferences submitted:', preferences.value)
	alert('Preferences updated!')
}
</script>

<style scoped>
.input {
	box-sizing: border-box;
	@apply w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
	box-sizing: border-box;
	@apply rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600;
}
</style>
