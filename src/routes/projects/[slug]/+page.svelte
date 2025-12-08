<script lang="ts">
	import type { PageProps } from './$types';
	import { marked } from 'marked';

	let { data }: PageProps = $props();
</script>

<section class="flex flex-col gap-4">
	<h1 class="text-3xl font-medium tracking-tight text-neutral-100 sm:text-4xl">
		E-commerce Platform
	</h1>
	<p class="text-neutral-400">
		A full-stack e-commerce solution with a custom CMS and payment integration.
	</p>
</section>
<section>
	<div class="flex flex-col gap-10 text-base leading-7 text-neutral-400">
		<p>
			This project involved designing and developing a fully-featured e-commerce platform from the
			ground up. The primary goal was to create a scalable, high-performance online store with a
			seamless user experience, from product discovery to checkout. We focused on a modular
			architecture to allow for easy integration of new features and third-party services.
		</p>
		<p>
			Key features include a robust product management system, secure user authentication, an
			intuitive shopping cart, and integration with Stripe for payment processing. The front-end was
			built with a focus on responsiveness and accessibility, ensuring a consistent experience
			across all devices.
		</p>
	</div>
</section>
<section class="flex flex-col gap-8">
	<h2 class="text-sm font-medium text-neutral-100">Project Info</h2>
	<div class="grid grid-cols-1 divide-y divide-neutral-800 border-y border-neutral-800">
		<div class="grid grid-cols-3 gap-4 py-4">
			<span class="text-neutral-500">Role</span>
			<span class="col-span-2 text-neutral-300"> Lead Frontend Engineer </span>
		</div>
		<div class="grid grid-cols-3 gap-4 py-4">
			<span class="text-neutral-500">Technologies</span>
			<div class="col-span-2 flex flex-wrap gap-x-4 gap-y-2">
				<span class="text-neutral-300">React</span>
				<span class="text-neutral-300">Next.js</span>
				<span class="text-neutral-300">TypeScript</span>
				<span class="text-neutral-300">Node.js</span>
				<span class="text-neutral-300">PostgreSQL</span>
				<span class="text-neutral-300">Stripe API</span>
			</div>
		</div>
		<div class="grid grid-cols-3 gap-4 py-4">
			<span class="text-neutral-500">Live Demo</span>
			<a
				class="group col-span-2 flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
				href="#"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span>View Project</span>
				<span
					class="material-symbols-outlined text-xl text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
				>
					arrow_forward
				</span>
			</a>
		</div>
	</div>
</section>
