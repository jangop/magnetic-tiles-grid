<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Tile from '$lib/components/Tile.svelte';
	import { browser } from '$app/environment';

	let colors = $state({
		red: { count: 10 },
		blue: { count: 10 },
		yellow: { count: 10 },
		green: { count: 10 },
		purple: { count: 10 },
		orange: { count: 10 }
	});

	let rows = $state(4);
	let cols = $state(4);
	let grid = $state<string[][]>([]);
	let symmetry = $state('none'); // 'none', 'mirror', 'rotation'

	function generateGrid() {
		let newGrid = Array(rows)
			.fill(null)
			.map(() =>
				Array(cols)
					.fill(null)
					.map(() => {
						const availableColors = Object.entries(colors)
							.filter(([_, info]) => info.count > 0)
							.map(([name]) => name);
						return availableColors[Math.floor(Math.random() * availableColors.length)];
					})
			);
		grid = newGrid;
	}

	$effect(() => {
		if (browser) {
			generateGrid();
		}
	});
</script>

<div class="container mx-auto max-w-2xl p-4">
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body p-4">
				<h2 class="card-title mb-4 text-lg">Grid Settings</h2>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="form-control">
						<label class="label" for="rows-input">
							<span class="label-text">Rows</span>
						</label>
						<input
							id="rows-input"
							type="number"
							bind:value={rows}
							min="1"
							max="8"
							class="input input-sm input-bordered w-full"
						/>
					</div>

					<div class="form-control">
						<label class="label" for="cols-input">
							<span class="label-text">Columns</span>
						</label>
						<input
							id="cols-input"
							type="number"
							bind:value={cols}
							min="1"
							max="8"
							class="input input-sm input-bordered w-full"
						/>
					</div>
				</div>

				<div class="mt-4 flex gap-2">
					<button class="btn btn-primary btn-sm" onclick={generateGrid}> Generate New Grid </button>
					<button class="btn btn-ghost btn-sm" onclick={() => window.print()}> Print Grid </button>
				</div>
			</div>
		</div>

		<!-- Grid Display -->
		<div class="card bg-base-200 shadow-xl print:shadow-none">
			<div class="card-body p-4">
				<div class="grid gap-1" style="grid-template-columns: repeat({cols}, minmax(0, 1fr))">
					{#each grid as row, i}
						{#each row as cell, j}
							<div class="h-12 w-12 print:h-24 print:w-24">
								<Tile color={cell} />
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>

		<!-- Color Inventory -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body p-4">
				<h2 class="card-title mb-4 text-lg">Available Colors</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
					{#each Object.entries(colors) as [name, info]}
						<div class="form-control">
							<label class="label" for={`${name}-input`}>
								<span class="label-text capitalize">{name}</span>
							</label>
							<input
								id={`${name}-input`}
								type="number"
								bind:value={info.count}
								min="0"
								class="input input-sm input-bordered w-20"
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@media print {
		.card:not(:nth-child(2)) {
			display: none;
		}
		.card-body {
			padding: 0;
		}
		:global(body) {
			margin: 0;
			padding: 0;
		}
		.container {
			max-width: none !important;
			padding: 0 !important;
			margin: 0 !important;
		}
	}
</style>
