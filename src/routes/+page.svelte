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
	const SYMMETRY_TYPES = ['none', 'horizontal', 'vertical', 'rotation180', 'rotation90'] as const;
	type SymmetryType = (typeof SYMMETRY_TYPES)[number];

	let symmetry = $state<'random' | SymmetryType>('random');

	function generateGrid() {
		// If symmetry is random, pick a random type
		const effectiveSymmetry: SymmetryType =
			symmetry === 'random'
				? SYMMETRY_TYPES[Math.floor(Math.random() * SYMMETRY_TYPES.length)]
				: symmetry;

		// Create a copy of colors to track usage
		const colorUsage = Object.fromEntries(
			Object.entries(colors).map(([color, info]) => [color, { count: info.count }])
		);

		function getRandomAvailableColor(): string | null {
			const availableColors = Object.entries(colorUsage)
				.filter(([_, info]) => info.count > 0)
				.map(([name]) => name);

			if (availableColors.length === 0) return null;

			const color = availableColors[Math.floor(Math.random() * availableColors.length)];
			colorUsage[color].count--;
			return color;
		}

		let newGrid = Array(rows)
			.fill(null)
			.map(() => Array(cols).fill(null));

		switch (effectiveSymmetry) {
			case 'horizontal': {
				const midRow = Math.floor(rows / 2);
				// Fill top half
				for (let i = 0; i < midRow; i++) {
					for (let j = 0; j < cols; j++) {
						const color = getRandomAvailableColor();
						if (color) {
							newGrid[i][j] = color;
							newGrid[rows - 1 - i][j] = color; // Mirror to bottom
						}
					}
				}
				// If odd number of rows, fill middle row
				if (rows % 2 !== 0) {
					for (let j = 0; j < cols; j++) {
						const color = getRandomAvailableColor();
						if (color) {
							newGrid[midRow][j] = color;
						}
					}
				}
				break;
			}

			case 'vertical': {
				const midCol = Math.floor(cols / 2);
				// Fill left half
				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < midCol; j++) {
						const color = getRandomAvailableColor();
						if (color) {
							newGrid[i][j] = color;
							newGrid[i][cols - 1 - j] = color; // Mirror to right
						}
					}
				}
				// If odd number of columns, fill middle column
				if (cols % 2 !== 0) {
					for (let i = 0; i < rows; i++) {
						const color = getRandomAvailableColor();
						if (color) {
							newGrid[i][midCol] = color;
						}
					}
				}
				break;
			}

			case 'rotation180': {
				const midRow = Math.floor(rows / 2);
				const midCol = Math.floor(cols / 2);
				// Fill quarter of the grid
				for (let i = 0; i < midRow; i++) {
					for (let j = 0; j < midCol; j++) {
						const color = getRandomAvailableColor();
						if (color) {
							// Place in all four corners
							newGrid[i][j] = color;
							newGrid[i][cols - 1 - j] = color;
							newGrid[rows - 1 - i][j] = color;
							newGrid[rows - 1 - i][cols - 1 - j] = color;
						}
					}
				}
				break;
			}

			case 'rotation90': {
				const midRow = Math.floor(rows / 2);
				const midCol = Math.floor(cols / 2);
				// Fill quarter of the grid
				for (let i = 0; i < midRow; i++) {
					for (let j = 0; j < midCol; j++) {
						const color = getRandomAvailableColor();
						if (color) {
							// Rotate four times
							newGrid[i][j] = color;
							newGrid[j][rows - 1 - i] = color;
							newGrid[rows - 1 - i][cols - 1 - j] = color;
							newGrid[cols - 1 - j][i] = color;
						}
					}
				}
				break;
			}

			default: {
				// No symmetry - fill normally
				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						const color = getRandomAvailableColor();
						if (color) {
							newGrid[i][j] = color;
						}
					}
				}
			}
		}

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
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

					<div class="form-control">
						<label class="label" for="symmetry-input">
							<span class="label-text">Symmetry</span>
						</label>
						<select
							id="symmetry-input"
							bind:value={symmetry}
							class="select select-bordered select-sm w-full"
						>
							<option value="random">Random</option>
							<option value="none">None</option>
							<option value="horizontal">Horizontal Mirror</option>
							<option value="vertical">Vertical Mirror</option>
							<option value="rotation180">180° Rotation</option>
							<option value="rotation90">90° Rotation</option>
						</select>
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
				<div class="grid-container" style={`grid-template-columns: repeat(${cols}, 1fr);`}>
					{#each grid as row, i}
						{#each row as cell, j}
							<div class="grid-item">
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

	.grid-container {
		display: grid;
		gap: 8px; /* Adjust the gap as needed */
		border: 2px solid var(--base-300);
		max-width: fit-content; /* Adjusts to fit the content */
		margin: 0 auto; /* Centers the grid */
	}

	.grid-item {
		height: 3rem; /* Adjust the size as needed */
		width: 3rem;
	}

	@media print {
		.grid-item {
			height: 6rem;
			width: 6rem;
		}
	}
</style>
