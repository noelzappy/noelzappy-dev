<script lang="ts">
	let { children } = $props();
</script>

<div class="classic">
	<main>
		{@render children()}
	</main>
</div>
