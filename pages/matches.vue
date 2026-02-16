<template>
	<main class="h-full w-full overflow-auto p-0">
		<table class="box-border w-full border-collapse border border-gray-300">
			<thead>
				<tr class="bg-gray-100">
					<th class="border p-2 text-left">Picture</th>
					<th class="border p-2 text-left">Name</th>
					<th class="border p-2 text-left">Bio</th>
					<th class="border p-2 text-left">Industries</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="person in added"
					:key="person.email"
					class="cursor-pointer hover:bg-gray-50"
					@click="openDialog(person)"
				>
					<td class="border p-2">
						<img
							:src="person.photoUrl"
							alt="Picture"
							class="h-12 w-12 rounded-full object-cover"
						/>
					</td>
					<td class="border p-2">{{ person.firstName }}</td>
					<td class="border p-2">{{ person.bio }}</td>
					<td class="border p-2">
						{{ person.industries.join(', ') }}
					</td>
				</tr>
			</tbody>
		</table>

		<!-- Dialog -->
		<Dialog v-model:open="isDialogOpen">
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent class="w-96">
				<DialogHeader>
					<DialogTitle
						>Chat with {{ selectedPerson?.firstName }}</DialogTitle
					>
				</DialogHeader>

				<!-- Chat Room -->
				<div class="mb-2 flex h-64 flex-col overflow-y-auto border p-2">
					<div
						v-for="(message, index) in messages"
						:key="index"
						class="mb-1"
					>
						<strong>{{ message.sender }}:</strong>
						{{ message.text }}
					</div>
				</div>

				<div class="flex gap-2">
					<input
						v-model="newMessage"
						@keyup.enter="sendMessage"
						class="flex-1 rounded border px-2 py-1"
						placeholder="Type a message..."
					/>
					<button
						@click="sendMessage"
						class="rounded bg-blue-500 px-3 py-1 text-white"
					>
						Send
					</button>
				</div>
			</DialogContent>
		</Dialog>
	</main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-page' })

const authstore = useAuthManager()
const { added } = storeToRefs(authstore)

// Dialog state
const isDialogOpen = ref(false)
const selectedPerson = ref<any>(null)

// Chat messages
const messages = ref<{ sender: string; text: string }[]>([])
const newMessage = ref('')

// Open dialog
function openDialog(person: any) {
	selectedPerson.value = person
	messages.value = [] // reset chat or load history
	isDialogOpen.value = true
}

// Send message
function sendMessage() {
	if (!newMessage.value.trim()) return
	messages.value.push({
		sender: 'You',
		text: newMessage.value,
	})
	newMessage.value = ''
	// Optionally, simulate response
	setTimeout(() => {
		messages.value.push({
			sender: selectedPerson.value.firstName,
			text: 'Hello! Got your message.',
		})
	}, 1000)
}
</script>

<style scoped>
table {
	box-sizing: border-box;
	@apply w-full border border-gray-300;
}
th,
td {
	box-sizing: border-box;
	@apply border border-gray-300 px-3 py-2;
}
</style>
