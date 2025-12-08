<script lang="ts">
	const NavMenu = [
		{ name: 'Projects', href: '/projects' },
		{ name: 'Notes', href: '/notes' },
		{ name: 'Contact', href: '/contact' }
	];
</script>

<header class="flex items-center justify-between text-sm font-medium">
	<a class="text-neutral-100 hover:text-white transition-colors" href="/">Zappy</a>
	<nav class="flex items-center gap-6">
		{#each NavMenu as item}
			<a class="text-neutral-400 hover:text-white transition-colors" href={item.href}>
				{item.name}
			</a>
		{/each}
	</nav>
</header>
