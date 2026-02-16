<template>
	<main class="h-full w-full overflow-auto pl-0">
		<form
			@submit.prevent="onSubmit"
			class="grid grid-cols-1 gap-8 md:grid-cols-2"
		>
			<!-- Left column: Form fields -->
			<div class="space-y-6 pl-2">
				<!-- A1: Anagraphic -->
				<section class="space-y-2">
					<h2 class="font-semibold">Basic Info</h2>
					<input
						v-model="profile.firstName"
						type="text"
						placeholder="First name"
						class="input"
					/>
					<input
						v-model="profile.cityCountry"
						type="text"
						placeholder="City + Country / open to relocate"
						class="input"
					/>

					<TagsInput v-model="profile.languages" class="w-full">
						<TagsInputItem
							v-for="item in profile.languages"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput placeholder="English, Italian..." />
					</TagsInput>
				</section>

				<!-- A2: Founder headline -->
				<section class="space-y-2">
					<h2 class="font-semibold">Founder Headline</h2>
					<input
						v-model="profile.oneLiner"
						type="text"
						placeholder="What I’m building / want to build"
						class="input"
					/>
					<textarea
						v-model="profile.bio"
						placeholder="Short bio (~500 chars)"
						maxlength="500"
						class="input h-24 resize-none"
					/>
				</section>

				<!-- A3: Role radar sliders -->
				<section class="space-y-2">
					<h2 class="font-semibold">Role Radar (0–10)</h2>
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
							v-model.number="profile.radar[axis.key]"
							class="flex-1"
						/>
						<span>{{ profile.radar[axis.key] }}</span>
					</div>
				</section>

				<!-- A4: Hard skills -->
				<section class="space-y-2">
					<h2 class="font-semibold">Hard Skills</h2>
					<TagsInput v-model="profile.hardSkills" class="w-full">
						<TagsInputItem
							v-for="item in profile.hardSkills"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput placeholder="Python, React, AI..." />
					</TagsInput>
				</section>

				<!-- A5: Soft skills -->
				<section class="space-y-2">
					<h2 class="font-semibold">Soft Skills</h2>
					<TagsInput v-model="profile.softSkills" class="w-full">
						<TagsInputItem
							v-for="item in profile.softSkills"
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

				<!-- A6: Professional experience -->
				<section class="space-y-2">
					<h2 class="font-semibold">Professional Experience</h2>
					<input
						v-model="profile.currentRole"
						placeholder="Current role + company"
						class="input"
					/>
					<input
						v-model="profile.yearsExperience"
						placeholder="Years of experience"
						type="number"
						class="input"
					/>

					<TagsInput v-model="profile.industries" class="w-full">
						<TagsInputItem
							v-for="item in profile.industries"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput
							placeholder="Industries (comma-separated)"
						/>
					</TagsInput>
					<input
						v-model="profile.links"
						placeholder="LinkedIn / Portfolio / GitHub"
						class="input"
					/>
				</section>

				<!-- A7: Founder history -->
				<section class="space-y-2">
					<h2 class="font-semibold">Founder History</h2>
					<select
						v-model="profile.founderHistory.hasCreated"
						class="input"
					>
						<option value="no">No</option>
						<option value="yes">Yes</option>
					</select>
					<textarea
						v-if="profile.founderHistory.hasCreated === 'yes'"
						v-model="profile.founderHistory.description"
						placeholder="Description + URL"
						class="input h-24 resize-none"
					/>
				</section>

				<!-- A8: Personal layer -->
				<section class="space-y-2">
					<h2 class="font-semibold">Personal Layer</h2>
					<TagsInput v-model="profile.interests" class="w-full">
						<TagsInputItem
							v-for="item in profile.interests"
							:key="item"
							:value="item"
						>
							<TagsInputItemText />
							<TagsInputItemDelete />
						</TagsInputItem>
						<TagsInputInput placeholder="Sports, travel..." />
					</TagsInput>
					<input
						v-model="profile.workingStyle"
						placeholder="Working style (remote/hybrid/office)"
						class="input"
					/>
				</section>

				<div class="ml-4 flex flex-col items-center space-y-4">
					<h2 class="font-semibold">Profile Picture</h2>
					<img
						:src="profile.photoUrl || defaultPhoto"
						alt="Profile pic"
						class="h-48 w-48 rounded-full border object-cover"
					/>
					<input
						v-model="profile.photoUrl"
						placeholder="Photo URL"
						class="input"
					/>
					<button type="submit" class="btn btn-primary mt-4 w-full">
						Update Profile
					</button>
				</div>
			</div>

			<!-- Right column: Profile pic + submit -->
		</form>
	</main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-page' })

const defaultPhoto = 'https://via.placeholder.com/150'

const radarAxes = [
	{ key: 'tech', label: 'Tech' },
	{ key: 'business', label: 'Business' },
	{ key: 'product', label: 'Product' },
	{ key: 'sales', label: 'Sales/Growth' },
	{ key: 'ops', label: 'Ops/Finance' },
]

const profile = ref({
	firstName: '',
	cityCountry: '',
	languages: [] as string[],
	ageRange: '',
	oneLiner: '',
	bio: '',
	radar: {
		tech: 0,
		business: 0,
		product: 0,
		sales: 0,
		ops: 0,
	},
	hardSkills: [] as string[],
	softSkills: [] as string[],
	currentRole: '',
	yearsExperience: 0,
	industries: '',
	links: '',
	founderHistory: {
		hasCreated: 'no',
		description: '',
	},
	interests: [] as string[],
	workingStyle: '',
	photoUrl: '',
})

onMounted(() => {
	// TODO: fetch the user here!
	// NO FETCH IN LOGIN
	if (profile.value.photoUrl === '')
		profile.value.photoUrl = 'https://i.pravatar.cc/300'
})

const onSubmit = () => {
	const tags: string[] = []

	// Check radar values and push tags if >= 5
	if (profile.value.radar.tech >= 5) tags.push('Tech')
	if (profile.value.radar.business >= 5) tags.push('Business')
	if (profile.value.radar.product >= 5) tags.push('Product')
	if (profile.value.radar.sales >= 5) tags.push('Sales')
	if (profile.value.radar.ops >= 5) tags.push('Ops')

	// Prepare submission payload
	const payload = {
		...profile.value,
		tags,
	}

	console.log('Profile submitted with tags:', payload)
	alert('Profile updated!')
}
</script>

<style scoped>
.input {
	@apply w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
.btn {
	@apply rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600;
}
</style>
