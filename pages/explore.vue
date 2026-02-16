<template>
	<main class="flex h-full w-full justify-center pt-6">
		<section
			class="flex h-full w-full flex-col items-center justify-center"
			v-auto-animate
		>
			<!-- Top Thumbnail Carousel with hover info -->
			<Carousel
				class="h-36 w-full max-w-6xl sm:w-[80%]"
				@init-api="(val) => (emblaThumbnailApi = val)"
			>
				<CarouselContent class="flex gap-0">
					<CarouselItem
						v-for="(_, index) in suggestions.length"
						:key="index"
						class="min-w-[5rem] max-w-[8rem] cursor-pointer"
						@click="onThumbClick(index)"
					>
						<div
							class="group relative overflow-hidden rounded-md transition-all duration-500"
							:class="[
								selectedIndex === index
									? 'scaled opacity-100'
									: 'shrunk opacity-80',
								{ added: suggestions?.[index]?.added },
								{ removed: suggestions?.[index]?.removed },
							]"
						>
							<img
								:src="suggestions[index].photoUrl"
								alt="Profile"
								class="h-32 w-full rounded-md border object-cover"
							/>
							<!-- Hover Meta Info -->
							<div
								class="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-2 text-center text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<p class="font-bold">
									{{ suggestions[index].firstName }}
								</p>
								<p>{{ suggestions[index].oneLiner }}</p>
								<p>
									{{ suggestions[index].cityCountry }} | Age:
									{{ suggestions[index].ageRange }}
								</p>
								<p>
									Languages:
									{{
										suggestions[index].languages.join(', ')
									}}
								</p>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPrevious class="hidden items-center sm:flex" />
				<CarouselNext class="hidden items-center sm:flex" />
			</Carousel>

			<!-- Big Tinder-style Carousel (no hover info) -->
			<section
				v-if="suggestions.length > 0"
				class="flex h-[70vh] w-full items-center justify-center pt-6"
			>
				<Carousel
					class="relative w-full max-w-lg"
					@init-api="(val) => (emblaMainApi = val)"
				>
					<CarouselContent>
						<CarouselItem
							v-for="(person, index) in suggestions"
							:key="index"
						>
							<div
								class="flex h-[75vh] w-full items-center justify-center p-4"
							>
								<div
									class="relative h-full w-full max-w-md overflow-hidden rounded-3xl bg-black shadow-2xl"
									:class="[
										{ added: person.added },
										{ removed: person.removed },
									]"
								>
									<!-- Background Image -->
									<img
										:src="person.photoUrl"
										alt="Profile"
										class="absolute inset-0 h-full w-full object-cover"
									/>
									<Badge
										class="text-md absolute right-5 top-5"
									>
										AI insight:
										{{ Math.round(Math.random() * 100) }}%
										Match
									</Badge>

									<!-- Red Reject Tint -->
									<div
										v-if="person.removed"
										class="reject-overlay absolute inset-0 z-10 bg-red-600"
									/>

									<div
										v-if="person.added"
										class="reject-overlay absolute inset-0 z-10 bg-green-600"
									/>

									<!-- Dark gradient overlay -->
									<div
										class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
									/>

									<!-- Info Content -->
									<div
										class="absolute bottom-0 left-0 right-0 space-y-3 p-6 text-white"
									>
										<!-- Name + Age -->
										<div
											class="flex items-end justify-between"
										>
											<h2
												class="text-3xl font-bold leading-none"
											>
												{{ person.firstName }}
											</h2>
											<span
												class="text-lg font-medium opacity-90"
											>
												{{ person.ageRange }}
											</span>
										</div>

										<!-- One liner -->
										<p class="text-sm opacity-90">
											{{ person.oneLiner }}
										</p>

										<!-- Location -->
										<p class="text-xs opacity-80">
											📍 {{ person.cityCountry }}
										</p>

										<!-- Skills -->
										<div class="flex flex-wrap gap-2 pt-2">
											<span
												v-for="skill in person.hardSkills.slice(
													0,
													4,
												)"
												:key="skill"
												class="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs backdrop-blur-md"
											>
												{{ skill }}
											</span>
										</div>

										<!-- Action Buttons -->
										<div
											class="flex justify-center gap-10 pt-6"
										>
											<button
												@click="rejectProfile(index)"
												class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-red-500 shadow-lg transition hover:scale-110"
											>
												✕
											</button>

											<button
												@click="acceptProfile(index)"
												class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-green-500 shadow-lg transition hover:scale-110"
											>
												♥
											</button>
										</div>
									</div>
								</div>
							</div>
						</CarouselItem>
					</CarouselContent>
					<CarouselPrevious class="hidden items-center sm:flex" />
					<CarouselNext class="hidden items-center sm:flex" />
				</Carousel>
			</section>

			<section
				v-else
				class="flex h-1/2 flex-col items-center justify-center space-y-4 p-0 sm:p-6"
			>
				<SvgExplore class="h-2/5 w-full md:w-2/5" />
				<p class="text-muted-foreground">No suggestions available</p>
			</section>
		</section>
	</main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'

const images = [
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F444bbd39-79de-467b-ad39-ccf68b57a4eb%2FIMG_5360.jpg/size/w=550?exp=1771255294&sig=HYZTcIYCeckYqAmk86rpVb8vGdzQK347LV08tqqNT94&id=2e1a0727-3e2d-80af-8f89-fecc3d8dab3c&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ffc266bdf-a7fb-4eba-9699-e5bac376650f%2Ffoto_profilo.jpeg/size/w=550?exp=1771255300&sig=yJzbXYOAMbMxg_-ui29EZo41hyrfHJD4ivK3REIRnr8&id=2dfa0727-3e2d-8076-bf6c-f4990bf60a04&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F55660498-aac2-4b20-bb23-ccbf7380e01c%2Fimage_(18).png/size/w=550?exp=1771255306&sig=S_VKfqV8Z7adOgS4TvHVXtGg4q9rgUVoB9paFHsNXWA&id=2d6a0727-3e2d-80ab-aac0-d1043f95c45b&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F9124328a-9aa2-4150-9e52-186ef3b6f834%2Fprofile-full.jpg/size/w=550?exp=1771255313&sig=HTiAx48pJ5gMMF2tu0nPreJ5Pzy9uR3K20C7661GGoc&id=2dca0727-3e2d-8069-b7f8-d996842c4e5b&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F8c130e9b-22b2-4df9-a136-0361b3492c8e%2FIMG_20241004_184737.jpg/size/w=550?exp=1771255319&sig=crp8ec1gF1ouLlMWhWWmrSzRvPVKr258TsIqz6irz0c&id=2d8a0727-3e2d-80de-aa91-e29b674ec811&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F793dd2ac-bb10-4d23-a451-76ad83f51c86%2FIMG_0147.jpeg/size/w=550?exp=1771255326&sig=jLy57R5hGBdfzpKUggUwn9UO9PNhhL-X3IqM5EfR4mE&id=2d8a0727-3e2d-80be-83e5-c0f0945cf826&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F634a5155-f6c2-4f65-bb38-45124a8807f3%2FWhatsApp_Image_2025-12-01_at_09.55.06.jpeg/size/w=550?exp=1771255332&sig=6nMZv_qrSX80wLGonhfugp9PohFZbGjbZbtRa29th3s&id=2cea0727-3e2d-814a-a5a4-e1acebb083e0&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F675949b9-3399-4b80-a27f-c0f3bc5c8918%2FImagen2.jpg/size/w=550?exp=1771255338&sig=jMC7UAhydfGf9waNou9-qlR2v5rLuL1GHuH2WekkGwY&id=2e2a0727-3e2d-809d-a7c5-fd1feed897fd&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F1376a023-5095-4c46-891e-6e07f971614f%2Fe00c3351-eb80-4e71-ad42-17398fa1a9f7.jpeg/size/w=550?exp=1771255348&sig=t-wI1j4VuuPBNRptVJ4rOTTNrNMEhIoY9R4xFwb1rgc&id=2d3a0727-3e2d-80ef-8287-c9c2796af281&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F4246abd3-4880-42ae-b3cb-a11f20c57681%2F7164153b-3786-4038-a580-625d48568591.jpg/size/w=550?exp=1771255355&sig=RDhN7ZUKQ3u4Ngq9WbfkN04akNF9wLzKmjFWDYn-UV8&id=2d2a0727-3e2d-800c-89bd-de5ef5e914eb&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff39a6d34-8738-41f1-8358-7cf70320d6d9%2FBolgiani_Jacopo_-_Foto_curriculum_vitae_(2)_(2).jpg/size/w=550?exp=1771255363&sig=QcJ-bpGSiFw_raLV7NEgIXH1q7MEkkrZXP5SW2CPA-I&id=2d2a0727-3e2d-8025-8786-f8e1a291ac8e&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff7ea7970-32a9-44f9-8b3c-1dba78d0d9e7%2F1516947528980.jpeg/size/w=550?exp=1771255372&sig=8vp_xWoSmPMktK0wVPNvabqSz33fKyes88yIOhAY7vY&id=2d3a0727-3e2d-8021-9944-c67fa449f248&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F2a7c0c36-725d-4021-ae38-e4ab6ace370f%2FIMG_6726.jpg/size/w=550?exp=1771255378&sig=qnRWPj4zp2YpqzddlizPvKmsax2B1tuzX7PBOsj1bSk&id=2d8a0727-3e2d-809e-993a-d0589b72921b&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F98acfa68-bc8e-4e9d-b347-9a8fe27d70ff%2FFoto_Profilo_-_LQ.jpg/size/w=550?exp=1771255385&sig=0sVt6tn7iTEptlM5-WkmFc0XMaaCAP8YhhoJBW4ppoI&id=2d3a0727-3e2d-80fa-832c-dd2002a369a7&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff1dc2fe3-634f-40c7-a5d3-0b6c5be81593%2Fid2.png/size/w=550?exp=1771255390&sig=bmRgJgsgPciu89vIjCdCyImgvpBxYMkVWavIJcXdpZg&id=2d3a0727-3e2d-80b7-99f4-ce223a2978b6&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F96d9fc63-0b94-4c20-b4be-5e5e9e5a8984%2Fmichele.cipollone-502.jpg/size/w=550?exp=1771255398&sig=4qj8vTtyvQEi3HkDqk3swlufLseOAokNXpJ8T55jH8g&id=2d4a0727-3e2d-809f-8cca-eef6283f1499&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fc51fe190-0f71-464e-ac69-0842a9e09844%2FFoto_Francesca_Basso.jpg/size/w=550?exp=1771255404&sig=k2C9Q7nRhiXLOchAm7ONdJ7nlVbMNA-uFvDOm756taU&id=2d5a0727-3e2d-80fc-8bab-f9c4904656bd&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fe768a349-804d-43f6-b05f-790896c9e230%2FIMG_6933.jpg/size/w=550?exp=1771255410&sig=S4rB4ilgqeQiuC-iekPdxoZjohrKFeavS3vb68gAVrc&id=2d5a0727-3e2d-808a-83e3-fc7f57a31a32&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F95a0354c-9f57-4a02-9d51-2ac3abe3a63b%2Ffile_(3).png/size/w=550?exp=1771255415&sig=Js9fEtVBvh-qsp58KD45CJN-P9y9eydM6AAz0jM3G5Q&id=2d7a0727-3e2d-80b8-944f-ccd98df0a424&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff4462921-d756-472f-8961-7d8b9f1d6b79%2FIMG_0752.jpeg/size/w=550?exp=1771255424&sig=5uX_25d5gCD-chxChG_VMjjmGQjxBb3hm5fE1sn_T1Y&id=2d7a0727-3e2d-805b-8367-f71219d64917&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F819f49fe-6385-40dc-b394-997b5a4d80e3%2FIMG_1387min.jpg/size/w=550?exp=1771255442&sig=bRYGprgWnxyZjCEfURb8CSSxy7bklvi-Seo-voH3yRU&id=2d8a0727-3e2d-80c6-8109-f1501e97221d&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fc490176d-878f-49bc-91e7-be84de053ead%2FIMG_2238.jpg/size/w=550?exp=1771255448&sig=DC2H5NkO1DOaykmPksTraWvv3wF2uxkGKBhmINUIIlU&id=2d8a0727-3e2d-8025-a756-f99d590517aa&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fe2e4fee7-660b-4ef3-8c05-89acb273fe95%2FfotoLinkedin.jpg/size/w=550?exp=1771255454&sig=XrZTVCF1FTMcA-1MKrMCHWijf2LRkAlzrbdGTgdOJbk&id=2daa0727-3e2d-80cb-abe7-ee9268c2f057&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F0b9ac5bb-2d7c-4491-bced-9d69c82c2525%2FFollador_Giulia.jpg/size/w=550?exp=1771255460&sig=9cftZf4K54bWFpukSDMAn4xwSM4WEpLUrF8ssouUWTQ&id=2dca0727-3e2d-8069-9dbe-faa61aad5ef3&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F6ee99de6-f7c3-4720-88c3-0101cdb6171b%2F2cut.jpg/size/w=550?exp=1771255467&sig=-9NNy8TiXDBH-cxZloGTT3p-7ZRjultbMKNgfrMMnRE&id=2dda0727-3e2d-8008-832b-ec047b645e73&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ffacbf374-2fbe-4eb6-8bb5-bc69e239ec8a%2F1676385063126.jpg/size/w=550?exp=1771255473&sig=5SesqlRJo8g5reP-_AUb3H5uKeFtuXm1qL6QFNJlw08&id=2dea0727-3e2d-8082-8bf7-e95672598ea1&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F55660498-aac2-4b20-bb23-ccbf7380e01c%2Fimage_(18).png/size/w=550?exp=1771255306&sig=S_VKfqV8Z7adOgS4TvHVXtGg4q9rgUVoB9paFHsNXWA&id=2d6a0727-3e2d-80ab-aac0-d1043f95c45b&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F4213c80e-19fc-44b8-ac10-90145460505f%2Fprofile.jpeg/size/w=550?exp=1771255479&sig=ARDTz8QS3WraaXoegbtowmWuQ6wtuL6CkI6ZTNwRuOA&id=2dfa0727-3e2d-80a3-b95d-f7a568957470&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F27e5d41a-30bc-492d-8961-646d1b2068b0%2FIMG_6736.png/size/w=550?exp=1771255487&sig=RiqvjMRlWebU2URiA2LwZsE5x4vKwgXvKT4iS5GkM5k&id=2dfa0727-3e2d-8056-9882-d753d9deb902&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fdf81ff7b-66d6-470a-ab97-2f2dc86f4396%2FWhatsApp_Image_2026-01-06_at_15.45.54.jpeg/size/w=550?exp=1771255494&sig=XiEAi9n0BU7hKA0_qZuRlxc_Av0lgEOl3wBeUbiTCdA&id=2e0a0727-3e2d-804d-b01c-c2dbed3663d6&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F675949b9-3399-4b80-a27f-c0f3bc5c8918%2FImagen2.jpg/size/w=550?exp=1771255338&sig=jMC7UAhydfGf9waNou9-qlR2v5rLuL1GHuH2WekkGwY&id=2e2a0727-3e2d-809d-a7c5-fd1feed897fd&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F6ee99de6-f7c3-4720-88c3-0101cdb6171b%2F2cut.jpg/size/w=550?exp=1771255467&sig=-9NNy8TiXDBH-cxZloGTT3p-7ZRjultbMKNgfrMMnRE&id=2dda0727-3e2d-8008-832b-ec047b645e73&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ffacbf374-2fbe-4eb6-8bb5-bc69e239ec8a%2F1676385063126.jpg/size/w=550?exp=1771255473&sig=5SesqlRJo8g5reP-_AUb3H5uKeFtuXm1qL6QFNJlw08&id=2dea0727-3e2d-8082-8bf7-e95672598ea1&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F0b9ac5bb-2d7c-4491-bced-9d69c82c2525%2FFollador_Giulia.jpg/size/w=550?exp=1771255460&sig=9cftZf4K54bWFpukSDMAn4xwSM4WEpLUrF8ssouUWTQ&id=2dca0727-3e2d-8069-9dbe-faa61aad5ef3&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F1376a023-5095-4c46-891e-6e07f971614f%2Fe00c3351-eb80-4e71-ad42-17398fa1a9f7.jpeg/size/w=550?exp=1771255348&sig=t-wI1j4VuuPBNRptVJ4rOTTNrNMEhIoY9R4xFwb1rgc&id=2d3a0727-3e2d-80ef-8287-c9c2796af281&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fc51fe190-0f71-464e-ac69-0842a9e09844%2FFoto_Francesca_Basso.jpg/size/w=550?exp=1771255404&sig=k2C9Q7nRhiXLOchAm7ONdJ7nlVbMNA-uFvDOm756taU&id=2d5a0727-3e2d-80fc-8bab-f9c4904656bd&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fe768a349-804d-43f6-b05f-790896c9e230%2FIMG_6933.jpg/size/w=550?exp=1771255410&sig=S4rB4ilgqeQiuC-iekPdxoZjohrKFeavS3vb68gAVrc&id=2d5a0727-3e2d-808a-83e3-fc7f57a31a32&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F95a0354c-9f57-4a02-9d51-2ac3abe3a63b%2Ffile_(3).png/size/w=550?exp=1771255415&sig=Js9fEtVBvh-qsp58KD45CJN-P9y9eydM6AAz0jM3G5Q&id=2d7a0727-3e2d-80b8-944f-ccd98df0a424&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff4462921-d756-472f-8961-7d8b9f1d6b79%2FIMG_0752.jpeg/size/w=550?exp=1771255424&sig=5uX_25d5gCD-chxChG_VMjjmGQjxBb3hm5fE1sn_T1Y&id=2d7a0727-3e2d-805b-8367-f71219d64917&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F819f49fe-6385-40dc-b394-997b5a4d80e3%2FIMG_1387min.jpg/size/w=550?exp=1771255442&sig=bRYGprgWnxyZjCEfURb8CSSxy7bklvi-Seo-voH3yRU&id=2d8a0727-3e2d-80c6-8109-f1501e97221d&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F4246abd3-4880-42ae-b3cb-a11f20c57681%2F7164153b-3786-4038-a580-625d48568591.jpg/size/w=550?exp=1771255355&sig=RDhN7ZUKQ3u4Ngq9WbfkN04akNF9wLzKmjFWDYn-UV8&id=2d2a0727-3e2d-800c-89bd-de5ef5e914eb&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff39a6d34-8738-41f1-8358-7cf70320d6d9%2FBolgiani_Jacopo_-_Foto_curriculum_vitae_(2)_(2).jpg/size/w=550?exp=1771255363&sig=QcJ-bpGSiFw_raLV7NEgIXH1q7MEkkrZXP5SW2CPA-I&id=2d2a0727-3e2d-8025-8786-f8e1a291ac8e&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff7ea7970-32a9-44f9-8b3c-1dba78d0d9e7%2F1516947528980.jpeg/size/w=550?exp=1771255372&sig=8vp_xWoSmPMktK0wVPNvabqSz33fKyes88yIOhAY7vY&id=2d3a0727-3e2d-8021-9944-c67fa449f248&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F2a7c0c36-725d-4021-ae38-e4ab6ace370f%2FIMG_6726.jpg/size/w=550?exp=1771255378&sig=qnRWPj4zp2YpqzddlizPvKmsax2B1tuzX7PBOsj1bSk&id=2d8a0727-3e2d-809e-993a-d0589b72921b&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F98acfa68-bc8e-4e9d-b347-9a8fe27d70ff%2FFoto_Profilo_-_LQ.jpg/size/w=550?exp=1771255385&sig=0sVt6tn7iTEptlM5-WkmFc0XMaaCAP8YhhoJBW4ppoI&id=2d3a0727-3e2d-80fa-832c-dd2002a369a7&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Ff1dc2fe3-634f-40c7-a5d3-0b6c5be81593%2Fid2.png/size/w=550?exp=1771255390&sig=bmRgJgsgPciu89vIjCdCyImgvpBxYMkVWavIJcXdpZg&id=2d3a0727-3e2d-80b7-99f4-ce223a2978b6&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F96d9fc63-0b94-4c20-b4be-5e5e9e5a8984%2Fmichele.cipollone-502.jpg/size/w=550?exp=1771255398&sig=4qj8vTtyvQEi3HkDqk3swlufLseOAokNXpJ8T55jH8g&id=2d4a0727-3e2d-809f-8cca-eef6283f1499&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fc490176d-878f-49bc-91e7-be84de053ead%2FIMG_2238.jpg/size/w=550?exp=1771255448&sig=DC2H5NkO1DOaykmPksTraWvv3wF2uxkGKBhmINUIIlU&id=2d8a0727-3e2d-8025-a756-f99d590517aa&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2Fe2e4fee7-660b-4ef3-8c05-89acb273fe95%2FfotoLinkedin.jpg/size/w=550?exp=1771255454&sig=XrZTVCF1FTMcA-1MKrMCHWijf2LRkAlzrbdGTgdOJbk&id=2daa0727-3e2d-80cb-abe7-ee9268c2f057&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F0b9ac5bb-2d7c-4491-bced-9d69c82c2525%2FFollador_Giulia.jpg/size/w=550?exp=1771255460&sig=9cftZf4K54bWFpukSDMAn4xwSM4WEpLUrF8ssouUWTQ&id=2dca0727-3e2d-8069-9dbe-faa61aad5ef3&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
	'https://img.notionusercontent.com/s3/prod-files-secure%2F67459369-5fae-4473-8afb-87e781e9e8a4%2F6ee99de6-f7c3-4720-88c3-0101cdb6171b%2F2cut.jpg/size/w=550?exp=1771255467&sig=-9NNy8TiXDBH-cxZloGTT3p-7ZRjultbMKNgfrMMnRE&id=2dda0727-3e2d-8008-832b-ec047b645e73&table=block&userId=454a3043-4c9e-4c59-b08f-540c79d87ecc',
]

const suggestions = ref([
	{
		firstName: 'José Sosa',
		cityCountry: 'Madrid, Spain',
		languages: ['Spanish', 'English'],
		ageRange: '28-38',
		oneLiner: 'Tech & product builder',
		bio: 'Combines technology and product thinking across information security and consulting.',
		radar: { tech: 8, business: 7, product: 8, sales: 6, ops: 6 },
		hardSkills: [
			'Product Management',
			'Information Security',
			'Consulting',
		],
		softSkills: ['Analytical Thinking', 'Communication'],
		currentRole: 'Product Leader',
		yearsExperience: 8,
		industries: [
			'Information Security',
			'Education',
			'Hospitality',
			'Consulting',
		],
		tags: ['Tech', 'Business', 'Product'],
		interests: ['Cycling', 'Running', 'Trekking', 'Swimming'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Remote',
		photoUrl: '',
		email: '',
	},
	{
		firstName: 'Mauro Ottobretti',
		cityCountry: 'Milan, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'Cloud & fintech architect',
		bio: 'Engineering leader specialized in fintech and large-scale cloud data architectures.',
		radar: { tech: 9, business: 7, product: 7, sales: 5, ops: 7 },
		hardSkills: [
			'Cloud Architecture',
			'Software Architecture',
			'Fintech Systems',
			'Data Engineering',
		],
		softSkills: ['Problem-solving', 'Mentorship'],
		currentRole: 'Engineering Lead',
		yearsExperience: 12,
		industries: ['Fintech', 'Loyalty', 'Education', 'Telecommunication'],
		tags: [
			'Tech',
			'Software',
			'Engineering',
			'Cloud',
			'Fintech',
			'Data Cloud Architecture',
			'Software Architecture',
		],
		interests: [
			'Music',
			'Singing',
			'Soccer',
			'Ski',
			'Investment',
			'Health',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Remaining profiles generated from your dataset (same structure)

	{
		firstName: 'Federico Paliotta',
		cityCountry: 'Rome, Italy',
		languages: ['Italian', 'English'],
		ageRange: '25-35',
		oneLiner: 'AI & cybersecurity technologist',
		bio: 'Working across AI, ML and cybersecurity-driven product development.',
		radar: { tech: 9, business: 6, product: 8, sales: 5, ops: 6 },
		hardSkills: [
			'AI',
			'Machine Learning',
			'Cybersecurity',
			'App Development',
			'Web Dev',
		],
		softSkills: ['Creativity', 'Design Thinking'],
		currentRole: 'Tech Lead',
		yearsExperience: 7,
		industries: [
			'AI',
			'Software Engineering',
			'Legal Tech',
			'Cybersecurity',
		],
		tags: [
			'Tech',
			'AI',
			'Machine Learning',
			'App development',
			'Webdev',
			'Cybersecurity',
			'Data science',
			'Product',
			'Design Thinking',
		],
		interests: [
			'Technology',
			'Science',
			'Art',
			'Geopolitics',
			'Social Justice',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	{
		firstName: 'Krishan Madan',
		cityCountry: 'London, UK',
		languages: ['English'],
		ageRange: '28-38',
		oneLiner: 'AI & product strategist',
		bio: 'Blending AI and product strategy across SaaS and blockchain.',
		radar: { tech: 8, business: 9, product: 8, sales: 7, ops: 7 },
		hardSkills: ['AI', 'Product Strategy', 'App Development', 'Software'],
		softSkills: ['Strategic Thinking', 'Execution'],
		currentRole: 'Product & Strategy Lead',
		yearsExperience: 9,
		industries: [
			'AI',
			'Fitness',
			'Food & Hospitality',
			'Blockchain',
			'B2B SaaS',
		],
		tags: [
			'Business',
			'Product',
			'Strategy',
			'AI',
			'Tech',
			'Software',
			'App Development',
		],
		interests: ['Fitness', 'Chess', 'Biohacking', 'Building'],
		links: '',
		founderHistory: {
			hasCreated: 'yes',
			description: 'Built AI-focused SaaS initiatives',
		},
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	{
		firstName: 'Enrico Licciardello',
		cityCountry: 'Milan, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'Finance & data cloud operator',
		bio: 'Operating at the intersection of finance, energy and robotics.',
		radar: { tech: 8, business: 8, product: 7, sales: 6, ops: 7 },
		hardSkills: ['Finance', 'Cloud Architecture', 'Data Systems'],
		softSkills: ['Analytical Thinking', 'Leadership'],
		currentRole: 'Strategy Lead',
		yearsExperience: 10,
		industries: ['Energy', 'Fintech', 'Robotics'],
		tags: ['Tech', 'Finance', 'Business', 'Data Cloud Architecture'],
		interests: ['Basketball', 'Stand-up Comedy', 'History', 'Geopolitics'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	{
		firstName: 'Meike Bingemann',
		cityCountry: 'Berlin, Germany',
		languages: ['German', 'English'],
		ageRange: '35-45',
		oneLiner: 'Operations & healthcare strategist',
		bio: 'Driving operations and people strategy in life sciences and consulting.',
		radar: { tech: 5, business: 9, product: 6, sales: 7, ops: 9 },
		hardSkills: ['Operations', 'Project Management', 'Healthcare Strategy'],
		softSkills: ['Leadership', 'People Management'],
		currentRole: 'Operations Director',
		yearsExperience: 15,
		industries: [
			'Life Sciences',
			'Consulting',
			'Corporate Learning',
			'Hospitality',
			'E-commerce',
		],
		tags: [
			'Business',
			'Operations',
			'People',
			'Strategy',
			'Project Management',
			'Healthcare',
		],
		interests: [],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Office',
		photoUrl: '',
		email: '',
	},
	{
		firstName: 'Leonardo Fancello',
		cityCountry: 'Rome, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'Business & AI product strategist',
		bio: 'Building AI-driven products and data science solutions for European markets.',
		radar: { tech: 8, business: 8, product: 8, sales: 7, ops: 6 },
		hardSkills: [
			'Business Strategy',
			'Product Management',
			'Data Science',
			'App Development',
			'AI',
		],
		softSkills: ['Leadership', 'Analytical Thinking'],
		currentRole: 'Product Manager',
		yearsExperience: 10,
		industries: ['AI', 'Tech', 'App Development'],
		tags: [
			'Business',
			'Product',
			'Strategy',
			'Data Science',
			'App Development',
			'Tech',
			'AI',
		],
		interests: [
			'Digital Platforms',
			'Economics',
			'ML',
			'Anime & Manga',
			'Movies',
			'Drinking Wine',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Lorenzo Zennaro
	{
		firstName: 'Lorenzo Zennaro',
		cityCountry: 'Venice, Italy',
		languages: ['Italian', 'English'],
		ageRange: '32-42',
		oneLiner: 'Finance & GTM strategist',
		bio: 'Specialized in business strategy and go-to-market execution in finance.',
		radar: { tech: 6, business: 9, product: 7, sales: 8, ops: 7 },
		hardSkills: ['Finance', 'Business Strategy', 'GTM'],
		softSkills: ['Strategic Thinking', 'Leadership'],
		currentRole: 'Strategy Consultant',
		yearsExperience: 12,
		industries: [],
		tags: ['Business', 'Finance', 'Strategy', 'GTM'],
		interests: ['Skiing'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Jacopo Bolgiani
	{
		firstName: 'Jacopo Bolgiani',
		cityCountry: 'Milan, Italy',
		languages: ['Italian', 'English'],
		ageRange: '28-38',
		oneLiner: 'Sales & GTM expert',
		bio: 'Focused on scaling B2B SaaS and sales strategy execution.',
		radar: { tech: 6, business: 9, product: 7, sales: 9, ops: 7 },
		hardSkills: ['Sales', 'GTM', 'Business Strategy', 'Product'],
		softSkills: ['Negotiation', 'Leadership'],
		currentRole: 'Head of Sales',
		yearsExperience: 9,
		industries: ['B2B SaaS'],
		tags: ['Business', 'Product', 'Sales', 'GTM'],
		interests: ['Deep Tech', 'Foods', 'Humanity', 'Gym', 'Bouldering'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Roberto Mottola
	{
		firstName: 'Roberto Mottola',
		cityCountry: 'Naples, Italy',
		languages: ['Italian', 'English'],
		ageRange: '35-45',
		oneLiner: 'Product & design strategist',
		bio: 'Designs impactful fintech and healthcare products with strategic insight.',
		radar: { tech: 7, business: 8, product: 9, sales: 6, ops: 6 },
		hardSkills: ['Product Design', 'Strategy', 'UX/UI', 'Fintech'],
		softSkills: ['Creativity', 'Leadership'],
		currentRole: 'Product Director',
		yearsExperience: 12,
		industries: ['Fintech', 'Healthcare'],
		tags: ['Product', 'Design', 'Strategy'],
		interests: [
			'Business',
			'Tech',
			'Architecture & Interiors',
			'History',
			'Politics',
			'Music',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Pietro Fantini
	{
		firstName: 'Pietro Fantini',
		cityCountry: 'Bologna, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'AI & product leader',
		bio: 'Building software and AI solutions for B2B SaaS and manufacturing.',
		radar: { tech: 9, business: 8, product: 8, sales: 6, ops: 6 },
		hardSkills: [
			'AI',
			'Software',
			'Cloud',
			'Product',
			'Business',
			'Partnerships',
		],
		softSkills: ['Problem-solving', 'Team Leadership'],
		currentRole: 'CTO',
		yearsExperience: 10,
		industries: ['Manufacturing', 'Retail', 'Software B2B SaaS'],
		tags: [
			'AI',
			'Tech',
			'Software',
			'Cloud',
			'Product',
			'Business',
			'Partnership',
		],
		interests: [
			'Tech',
			'Agentic Infrastructure',
			'Reg-tech',
			'Chess',
			'Board Games',
			'Tech Events',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Federico Baccaredda Boy
	{
		firstName: 'Federico Baccaredda Boy',
		cityCountry: 'Rome, Italy',
		languages: ['Italian', 'English'],
		ageRange: '28-38',
		oneLiner: 'Energy & tech product manager',
		bio: 'Leading projects in energy, mobility, and AI-powered product development.',
		radar: { tech: 9, business: 7, product: 8, sales: 6, ops: 7 },
		hardSkills: [
			'Tech Product Management',
			'Energy Projects',
			'AI',
			'Engineering',
		],
		softSkills: ['Creativity', 'Problem-solving'],
		currentRole: 'Product Manager',
		yearsExperience: 8,
		industries: ['Automotive', 'Mobility', 'Energy'],
		tags: [
			'Tech',
			'Product',
			'Energy',
			'Project Management',
			'Strategy',
			'Engineering',
			'App Development',
			'Photography',
		],
		interests: [
			'Surf',
			'Skiing',
			'Tennis',
			'Electronic Music',
			'Photography',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Angelo Savoca
	{
		firstName: 'Angelo Savoca',
		cityCountry: 'Palermo, Italy',
		languages: ['Italian', 'English'],
		ageRange: '32-42',
		oneLiner: 'AI & bioinformatics engineer',
		bio: 'Developing AI and machine learning solutions in healthcare and medtech.',
		radar: { tech: 9, business: 6, product: 7, sales: 5, ops: 5 },
		hardSkills: [
			'AI',
			'Data Science',
			'Machine Learning',
			'Bioinformatics',
			'Healthcare',
		],
		softSkills: ['Analytical Thinking', 'Problem-solving'],
		currentRole: 'AI Engineer',
		yearsExperience: 9,
		industries: [],
		tags: [
			'Tech',
			'Data Science',
			'AI',
			'BioInformatics',
			'Machine Learning',
			'Medtech',
			'Healthcare',
		],
		interests: [],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Michele Cipollone
	{
		firstName: 'Michele Cipollone',
		cityCountry: 'Naples, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'Tech & product operations leader',
		bio: 'Driving AI, web and product strategy in innovative companies.',
		radar: { tech: 9, business: 8, product: 9, sales: 6, ops: 8 },
		hardSkills: [
			'Tech Operations',
			'Product Management',
			'AI',
			'Design Thinking',
			'Web Dev',
			'VC',
			'Sales',
		],
		softSkills: ['Leadership', 'Strategy', 'Project Management'],
		currentRole: 'Operations & Product Lead',
		yearsExperience: 10,
		industries: ['Wealth', 'Tax Law', 'Insurance Tech'],
		tags: [
			'Tech',
			'Operations',
			'Product',
			'Design Thinking',
			'WebDev',
			'AI',
			'Design',
			'Business',
			'Strategy',
			'Project Management',
			'VC',
			'Sales',
		],
		interests: ['AI Engineering', 'SkyDiving', 'Calisthenics', 'Nutrition'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Francesca Basso
	{
		firstName: 'Francesca Basso',
		cityCountry: 'Milan, Italy',
		languages: ['Italian', 'English'],
		ageRange: '25-35',
		oneLiner: 'STEM & AI project leader',
		bio: 'Working across AI, machine learning and app development with a strong STEM and project management background.',
		radar: { tech: 8, business: 7, product: 7, sales: 5, ops: 7 },
		hardSkills: [
			'AI',
			'Machine Learning',
			'App Development',
			'Web Dev',
			'Project Management',
		],
		softSkills: ['Organization', 'Analytical Thinking'],
		currentRole: 'Tech Project Manager',
		yearsExperience: 7,
		industries: ['Fintech', 'Healthcare', 'Events', 'Social'],
		tags: [
			'Tech',
			'Business',
			'Stem',
			'Project Management',
			'AI',
			'APP Development',
			'Machine Learning',
			'Web Dev',
		],
		interests: [],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Francesco Fiore
	{
		firstName: 'Francesco Fiore',
		cityCountry: 'Rome, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'AI & cloud architecture builder',
		bio: 'Engineering modern cloud and AI architectures across healthcare, energy and media.',
		radar: { tech: 9, business: 7, product: 8, sales: 5, ops: 7 },
		hardSkills: [
			'AI',
			'Cloud',
			'Software Engineering',
			'System Design',
			'Product Development',
		],
		softSkills: ['Execution', 'Automation Mindset'],
		currentRole: 'Software Architect',
		yearsExperience: 10,
		industries: ['IT Consulting', 'Cloud', 'Energy & Utilities', 'Media'],
		tags: [
			'Tech',
			'AI',
			'Cloud',
			'Software',
			'Engineering',
			'Builder',
			'Modern Architectures',
			'Web Dev',
			'Healthcare',
			'App Development',
			'Design Thinking',
			'Product',
		],
		interests: [
			'System Design',
			'Product Execution',
			'Automation',
			'AI',
			'UX Craft',
			'Venture Building',
			'Operating & Metrics',
		],
		links: '',
		founderHistory: {
			hasCreated: 'yes',
			description:
				'Involved in venture building and AI product initiatives',
		},
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Andrea Mascarello
	{
		firstName: 'Andrea Mascarello',
		cityCountry: 'Turin, Italy',
		languages: ['Italian', 'English'],
		ageRange: '28-38',
		oneLiner: 'AI, robotics & wearable technologist',
		bio: 'Building AI-driven robotics, hardware and wearable solutions for enterprise.',
		radar: { tech: 9, business: 7, product: 8, sales: 5, ops: 6 },
		hardSkills: [
			'AI',
			'Data Science',
			'Robotics',
			'Machine Learning',
			'Hardware',
			'Software',
		],
		softSkills: ['Problem-solving', 'Research Mindset'],
		currentRole: 'AI & Robotics Engineer',
		yearsExperience: 9,
		industries: [
			'Fintech',
			'Gaming & Interactive Entertainment',
			'Manufacturing & Industrial Training',
			'Live Events & Creative Technology',
			'Enterprise Digital Solutions & Consulting',
		],
		tags: [
			'Tech',
			'Data Science',
			'AI',
			'Robotics',
			'Machine Learning',
			'Software',
			'Hardware',
			'Wearable',
			'Web Dev',
			'App Development',
		],
		interests: ['Music', 'Sport', 'Quantum Physics', 'Robotics', 'Chess'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Derick David
	{
		firstName: 'Derick David',
		cityCountry: 'London, UK',
		languages: ['English'],
		ageRange: '30-40',
		oneLiner: 'Product & finance-focused designer',
		bio: 'Designing well-crafted software products in fintech and AI.',
		radar: { tech: 7, business: 8, product: 9, sales: 6, ops: 6 },
		hardSkills: ['Product Design', 'Software', 'Finance'],
		softSkills: ['Creativity', 'Entrepreneurial Thinking'],
		currentRole: 'Product Designer',
		yearsExperience: 8,
		industries: ['Fintech', 'AI', 'Journalism'],
		tags: ['Product', 'Design', 'Software', 'Finance'],
		interests: [
			'Basketball',
			'Writing',
			'Classic Literature',
			'Entrepreneurship',
			'Well Designed Products',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Remote',
		photoUrl: '',
		email: '',
	},

	// Matteo Bonadies
	{
		firstName: 'Matteo Bonadies',
		cityCountry: 'Milan, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'Sales, finance & GTM operator',
		bio: 'Driving go-to-market, operations and finance strategy for scaling startups.',
		radar: { tech: 6, business: 9, product: 7, sales: 9, ops: 8 },
		hardSkills: ['Sales', 'GTM', 'Operations', 'Finance', 'Strategy'],
		softSkills: ['Leadership', 'Execution'],
		currentRole: 'Head of GTM',
		yearsExperience: 10,
		industries: [],
		tags: ['Business', 'Sales', 'GTM', 'Operations', 'Strategy', 'Finance'],
		interests: ['Music', 'Surf', 'Bike', 'Running', 'Tech & Startups'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Kaan Dai
	{
		firstName: 'Kaan Dai',
		cityCountry: 'Berlin, Germany',
		languages: ['English', 'German'],
		ageRange: '25-35',
		oneLiner: 'AI & ML cloud engineer',
		bio: 'Developing machine learning and cloud engineering solutions in manufacturing.',
		radar: { tech: 9, business: 6, product: 7, sales: 4, ops: 6 },
		hardSkills: [
			'AI',
			'Data Science',
			'Machine Learning',
			'Cloud',
			'Engineering',
		],
		softSkills: ['Analytical Thinking', 'Focus'],
		currentRole: 'ML Engineer',
		yearsExperience: 6,
		industries: ['Manufacturing'],
		tags: [
			'AI',
			'Data Science',
			'Machine Learning',
			'Cloud',
			'Tech',
			'Engineering',
		],
		interests: [
			'Basketball',
			'Running',
			'Snowboarding',
			'Crossfit',
			'Reading Books',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Silvio Corridore
	{
		firstName: 'Silvio Corridore',
		cityCountry: 'Rome, Italy',
		languages: ['Italian', 'English'],
		ageRange: '30-40',
		oneLiner: 'Digital marketing & sales strategist',
		bio: 'Scaling B2B and B2C digital platforms with strong marketing and sales execution.',
		radar: { tech: 7, business: 9, product: 7, sales: 9, ops: 7 },
		hardSkills: ['Marketing', 'Sales', 'Digital Strategy', 'Tech'],
		softSkills: ['Communication', 'Leadership'],
		currentRole: 'Marketing Director',
		yearsExperience: 11,
		industries: [
			'B2B & B2C Digital Marketing',
			'C2C Marketplaces',
			'Logistics and Supply Chain',
		],
		tags: ['Business', 'Sales', 'Tech', 'Marketing', 'Strategy'],
		interests: [
			'Football',
			'Cinema',
			'Reading',
			'Anime',
			'Board Games & Video Games',
		],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},

	// Giulia Follador
	{
		firstName: 'Giulia Follador',
		cityCountry: 'Venice, Italy',
		languages: ['Italian', 'English'],
		ageRange: '28-38',
		oneLiner: 'Finance & people-focused business leader',
		bio: 'Operating across finance, marketing and people strategy.',
		radar: { tech: 5, business: 9, product: 7, sales: 8, ops: 8 },
		hardSkills: ['Finance', 'Marketing', 'Sales', 'People Management'],
		softSkills: ['Leadership', 'Strategic Thinking'],
		currentRole: 'Business Manager',
		yearsExperience: 9,
		industries: [],
		tags: [
			'Business',
			'Finance',
			'Marketing',
			'Sales',
			'Strategy',
			'People',
		],
		interests: ['Sport'],
		links: '',
		founderHistory: { hasCreated: 'no', description: '' },
		workingStyle: 'Hybrid',
		photoUrl: '',
		email: '',
	},
	// ----

	// Francesca Basso
	// Francesco Fiore
	// Andrea Mascarello
	// Derick David
	// Matteo Bonadies
	// Kaan Dai
	// Silvio Corridore
	// Giulia Follador
	// Joseph Insirello
	// Francesco Visalli
	// Roberto Palladino
	// Carlotta Alice Bianchi
	// Margherita Febbrari
	// Giovanni Fazzi
	// Silvia Velmer
	// Ismet Kaan Yilmaz
	// Marihum Pernia
	// Fernanda Ferreira
	// Arianna Fossati
	// Andrea Gay
	// Daniele Caliò
	// Matteo Nicoli
])

const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)

function onSelect() {
	if (!emblaMainApi.value || !emblaThumbnailApi.value) return
	selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
	emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index: number) {
	if (
		!emblaMainApi.value ||
		!emblaThumbnailApi.value ||
		!suggestions.value[index]
	)
		return
	emblaMainApi.value.scrollTo(index, true)
}

const authstore = useAuthManager()
const { added } = storeToRefs(authstore)

const acceptProfile = (index: number) => {
	suggestions.value[index].added = true
	added.value.push(suggestions.value[index])
	setTimeout(() => {
		suggestions.value.splice(index, 1)
	}, 600)
}

const rejectProfile = (index: number) => {
	suggestions.value[index].removed = true
	setTimeout(() => {
		suggestions.value.splice(index, 1)
	}, 600)
}

onMounted(() => {
	emblaMainApi.value?.on('select', onSelect)
	emblaMainApi.value?.on('reInit', onSelect)
	for (let i = 0; i < suggestions.value.length; i++) {
		suggestions.value[i].photoUrl = images[i]
	}
})

definePageMeta({ layout: 'dashboard-page' })
</script>

<style scoped>
.btn {
	@apply rounded px-4 py-2 font-semibold text-white;
}
.btn-green {
	@apply bg-green-500 hover:bg-green-600;
}
.btn-red {
	@apply bg-red-500 hover:bg-red-600;
}

.scaled {
	scale: 1.1;
}
.shrunk {
	scale: 0.9;
	opacity: 0.8;
}
.added {
	animation: swipe 0.6s ease-in-out forwards;
}
.initialApear {
	scale: 0;
	animation: appear 0.6s ease-in-out forwards;
}

@keyframes disappear {
	from {
		scale: 1;
		opacity: 1;
	}
	to {
		scale: 0;
		opacity: 0;
	}
}
@keyframes appear {
	from {
		scale: 0;
		opacity: 0;
	}
	to {
		scale: 1;
		opacity: 1;
	}
}

.removed {
	animation: rejectSwipe 0.6s ease-in-out forwards;
}

@keyframes swipe {
	0% {
		transform: translateX(0) rotate(0);
		opacity: 1;
	}
	50% {
		transform: translateX(40px) rotate(5deg);
	}
	100% {
		transform: translateX(200px) rotate(15deg);
		opacity: 0;
	}
}

@keyframes rejectSwipe {
	0% {
		transform: translateX(0) rotate(0);
		opacity: 1;
	}
	50% {
		transform: translateX(-40px) rotate(-5deg);
	}
	100% {
		transform: translateX(-200px) rotate(-15deg);
		opacity: 0;
	}
}

@keyframes rejectFlash {
	0% {
		opacity: 0;
	}
	40% {
		opacity: 0.6;
	}
	100% {
		opacity: 0.9;
	}
}
.reject-overlay {
	animation: rejectFlash 0.6s ease-in-out forwards;
	opacity: 0;
}
</style>
