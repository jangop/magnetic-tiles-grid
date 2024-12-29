<script lang="ts">
	export let color: string;

	$: colorObj = {
		left: `var(--tile-${color}-base)`,
		right: `var(--tile-${color}-base)`,
		bottom: `var(--tile-${color}-light)`,
		top: `var(--tile-${color}-dark)`
	};
</script>

<div class="tile-container">
	<svg viewBox="0 0 100 100" class="h-full w-full">
		<!-- Top-left triangle -->
		<path d="M0 0 L50 50 L0 100 Z" fill={colorObj.left} />
		<!-- Top-right triangle -->
		<path d="M100 0 L50 50 L100 100 Z" fill={colorObj.right} />
		<!-- Bottom-left triangle -->
		<path d="M0 100 L50 50 L100 100 Z" fill={colorObj.bottom} />
		<!-- Bottom-right triangle -->
		<path d="M0 0 L50 50 L100 0 Z" fill={colorObj.top} />
	</svg>
</div>

<style>
	.tile-container {
		aspect-ratio: 1;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
	}

	/* Define CSS variables for the colors */
	:global(:root) {
		--tile-red-light: rgb(255, 107, 107);
		--tile-red-base: rgb(255, 0, 0);
		--tile-red-dark: rgb(204, 0, 0);

		--tile-blue-light: rgb(77, 169, 255);
		--tile-blue-base: rgb(0, 102, 204);
		--tile-blue-dark: rgb(0, 76, 153);

		--tile-yellow-light: rgb(255, 224, 102);
		--tile-yellow-base: rgb(255, 215, 0);
		--tile-yellow-dark: rgb(204, 177, 0);

		--tile-green-light: rgb(102, 204, 102);
		--tile-green-base: rgb(51, 153, 51);
		--tile-green-dark: rgb(38, 115, 38);

		--tile-purple-light: rgb(179, 102, 255);
		--tile-purple-base: rgb(128, 0, 255);
		--tile-purple-dark: rgb(102, 0, 204);

		--tile-orange-light: rgb(255, 179, 102);
		--tile-orange-base: rgb(255, 128, 0);
		--tile-orange-dark: rgb(204, 102, 0);
	}
</style>
