<script lang="ts">
	interface Props {
		text: string;
		class?: string;
	}
	let { text, class: className = '' }: Props = $props();
</script>

<span class="section-label {className}">{text}</span>
