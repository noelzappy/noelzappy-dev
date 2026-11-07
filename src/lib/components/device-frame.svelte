<script lang="ts">
	/**
	 * Pure-CSS device frames. Every measurement is in `cqw` (percent of the frame's own width), so a
	 * frame scales as one object at any size.
	 *
	 * Phone proportions follow a modern iPhone: 9:19.5 screen, bezel 2.5% of width, outer corner
	 * radius 13.5% of width, dynamic island 32% wide. Outer box = screen + 2 * bezel, hence
	 * 1 : 2.108.
	 */
	let {
		kind,
		src,
		alt,
		width = '100%',
		loading = 'lazy'
	}: {
		kind: 'phone' | 'browser';
		src: string;
		alt: string;
		/** CSS length; the frame fills its container by default. */
		width?: string;
		loading?: 'lazy' | 'eager';
	} = $props();
</script>

<div class="frame" style:width>
	{#if kind === 'phone'}
		<div class="body phone">
			<span class="button power" aria-hidden="true"></span>
			<span class="button volume" aria-hidden="true"></span>
			<div class="screen">
				<img {src} {alt} {loading} decoding="async" draggable="false" />
				<span class="island" aria-hidden="true"></span>
			</div>
		</div>
	{:else}
		<div class="body browser">
			<div class="chrome" aria-hidden="true">
				<span class="dots"><i></i><i></i><i></i></span>
				<span class="address"></span>
			</div>
			<img {src} {alt} {loading} decoding="async" draggable="false" />
		</div>
	{/if}
</div>

<style>
	/* `cqw` resolves against the nearest *ancestor* container, so the container is the outer box and
	   the styled device is its child. */
	.frame {
		container-type: inline-size;
		display: block;
		max-width: 100%;
	}
	.body {
		position: relative;
	}
	img {
		display: block;
		width: 100%;
		-webkit-user-drag: none;
		user-select: none;
	}

	/* ─── Phone ─── */
	.phone {
		aspect-ratio: 1 / 2.108;
		padding: 2.5cqw;
		box-sizing: border-box;
		border-radius: 13.5cqw;
		background: #0a0a0b;
		/* Titanium edge: a thin lit ring outside, a hairline highlight inside, one soft drop shadow. */
		box-shadow:
			0 0 0 0.35cqw #4a4a4e,
			inset 0 0 0 0.3cqw rgba(255, 255, 255, 0.16),
			0 5cqw 9cqw -2cqw rgba(0, 0, 0, 0.38);
	}
	.screen {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 11cqw;
		background: #fff;
		/* Inner bezel line where glass meets frame. */
		outline: 0.25cqw solid #000;
		outline-offset: -0.25cqw;
	}
	.screen img {
		height: 100%;
		object-fit: cover;
		object-position: top center;
	}
	.island {
		position: absolute;
		top: 2.6cqw;
		left: 50%;
		width: 30.4cqw;
		height: 8.9cqw;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #000;
	}
	.button {
		position: absolute;
		width: 0.7cqw;
		border-radius: 0.4cqw;
		background: #3a3a3e;
	}
	.power {
		right: -1.05cqw;
		top: 30cqw;
		height: 16cqw;
	}
	.volume {
		left: -1.05cqw;
		top: 24cqw;
		height: 22cqw;
	}

	/* ─── Browser ─── */
	.browser {
		overflow: hidden;
		border-radius: 1.6cqw;
		background: #fff;
		box-shadow:
			0 0 0 0.12cqw rgba(0, 0, 0, 0.14),
			0 4cqw 8cqw -2cqw rgba(0, 0, 0, 0.32);
	}
	.chrome {
		display: flex;
		align-items: center;
		gap: 2.2cqw;
		height: 4.4cqw;
		padding: 0 2cqw;
		background: #ececee;
		border-bottom: 0.12cqw solid rgba(0, 0, 0, 0.1);
	}
	.dots {
		display: flex;
		gap: 0.9cqw;
	}
	.dots i {
		width: 1.1cqw;
		height: 1.1cqw;
		border-radius: 50%;
		background: #c4c4c8;
	}
	.address {
		flex: 0 1 38cqw;
		height: 2.3cqw;
		margin: 0 auto;
		border-radius: 999px;
		background: #fafafb;
	}
</style>
