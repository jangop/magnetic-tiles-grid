<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Tile from '$lib/components/Tile.svelte';
	import { browser } from '$app/environment';

	let colors = $state({
		red: { count: 4 },
		blue: { count: 4 },
		yellow: { count: 4 },
		green: { count: 4 },
		purple: { count: 8 },
		orange: { count: 4 }
	});

	let rows = $state(4);
	let cols = $state(4);
	let grid = $state<string[][]>([]);
	let patterns = $state<string[][][]>([]); // Array of grids
	let selectedPatternIndex = $state<number>(0);
	const SYMMETRY_TYPES = ['none', 'horizontal', 'vertical', 'rotation180', 'rotation90'] as const;
	type SymmetryType = (typeof SYMMETRY_TYPES)[number];

	let symmetry = $state<'random' | SymmetryType>('random');

	let patternCount = $state(9); // Default number of patterns to generate

	// Update grid when selected pattern changes
	$effect(() => {
		if (patterns.length > 0) {
			grid = patterns[selectedPatternIndex];
		}
	});

	function generateGrid(colorUsage: Record<string, { count: number }>) {
		// If symmetry is random, pick a random type
		const effectiveSymmetry: SymmetryType =
			symmetry === 'random'
				? SYMMETRY_TYPES[Math.floor(Math.random() * SYMMETRY_TYPES.length)]
				: symmetry;

		function getRandomAvailableColor(multiplier: number = 1): string | null {
			const availableColors = Object.entries(colorUsage)
				.filter(([_, info]) => info.count >= multiplier)
				.map(([name]) => name);

			if (availableColors.length === 0) return null;

			const color = availableColors[Math.floor(Math.random() * availableColors.length)];
			colorUsage[color].count -= multiplier;
			return color;
		}

		let newGrid = Array(rows)
			.fill(null)
			.map(() => Array(cols).fill(null));

		switch (effectiveSymmetry) {
			case 'horizontal': {
				const midRow = Math.floor(rows / 2);
				// Fill top half (needs 2 tiles per color)
				for (let i = 0; i < midRow; i++) {
					for (let j = 0; j < cols; j++) {
						const color = getRandomAvailableColor(2); // Will use 2 tiles
						if (color) {
							newGrid[i][j] = color;
							newGrid[rows - 1 - i][j] = color;
						}
					}
				}
				// Middle row (if odd) only needs 1 tile per color
				if (rows % 2 !== 0) {
					for (let j = 0; j < cols; j++) {
						const color = getRandomAvailableColor(1);
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
						const color = getRandomAvailableColor(2);
						if (color) {
							newGrid[i][j] = color;
							newGrid[i][cols - 1 - j] = color; // Mirror to right
						}
					}
				}
				// If odd number of columns, fill middle column
				if (cols % 2 !== 0) {
					for (let i = 0; i < rows; i++) {
						const color = getRandomAvailableColor(1);
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
						const color = getRandomAvailableColor(4);
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
						const color = getRandomAvailableColor(4);
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
						const color = getRandomAvailableColor(1);
						if (color) {
							newGrid[i][j] = color;
						}
					}
				}
			}
		}

		return newGrid;
	}

	function generateMultipleGrids(count: number = 9) {
		let newPatterns = [];
		for (let i = 0; i < count; i++) {
			// Clone colors for each pattern
			const colorUsage = Object.fromEntries(
				Object.entries(colors).map(([color, info]) => [color, { count: info.count }])
			);
			let pattern = generateGrid(colorUsage);
			newPatterns.push(pattern);
		}
		patterns = newPatterns;
		selectedPatternIndex = 0;
	}

	$effect(() => {
		if (browser) {
			generateMultipleGrids(9);
		}
	});
</script>

<div class="container mx-auto max-w-2xl p-4">
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body p-4">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
					<div class="form-control">
						<label class="label" for="pattern-count">
							<span class="label-text">Number of Patterns</span>
						</label>
						<input
							id="pattern-count"
							type="number"
							bind:value={patternCount}
							min="1"
							max="15"
							class="input input-sm input-bordered w-20"
						/>
					</div>
				</div>

				<div class="flex gap-2">
					<button
						class="btn btn-primary btn-sm"
						onclick={() => generateMultipleGrids(patternCount)}
					>
						Generate Patterns
					</button>
					<button class="btn btn-secondary btn-sm" onclick={() => window.print()}>
						Print All Patterns
					</button>
				</div>
			</div>
		</div>

		<!-- Selected Grid Display -->
		<div class="card bg-base-200 shadow-xl">
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

		<!-- Pattern Gallery -->
		<div class="card bg-base-200 shadow-xl print:hidden">
			<div class="card-body p-4">
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
					{#each patterns as pattern, i}
						<button
							class="relative rounded-lg p-2 transition-colors hover:bg-base-300"
							class:bg-primary-content={i === selectedPatternIndex}
							onclick={() => (selectedPatternIndex = i)}
						>
							<div
								class="grid-container-small"
								style={`grid-template-columns: repeat(${cols}, 1fr);`}
							>
								{#each pattern as row, i}
									{#each row as cell, j}
										<div class="grid-item-small">
											<Tile color={cell} />
										</div>
									{/each}
								{/each}
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Color Inventory -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body p-4">
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
		/* Reset all cards for print */
		.card {
			display: block !important;
			background: none !important;
			box-shadow: none !important;
			break-inside: avoid !important;
		}

		/* Hide controls and color inventory */
		.card:first-child,
		.card:last-child {
			display: none !important;
		}

		/* Hide the large selected pattern display */
		.card:nth-child(3) {
			display: none !important;
		}

		/* Show the pattern gallery */
		.print:hidden {
			display: block !important;
		}

		.card-body {
			padding: 0.5cm !important;
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

		/* Adjust grid size for printing */
		.grid-container-small {
			gap: 4px !important;
		}

		.grid-item-small {
			height: 2rem !important;
			width: 2rem !important;
		}

		/* Layout for print */
		.grid {
			grid-template-columns: repeat(3, 1fr) !important;
			gap: 1cm !important;
		}

		/* Ensure good page breaks */
		@page {
			margin: 1cm;
		}

		button {
			border: 1px solid #ccc !important;
			background: none !important;
		}

		button:hover {
			background: none !important;
		}

		.card-title {
			display: none !important;
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

	.grid-container-small {
		display: grid;
		gap: 2px;
		border: 1px solid var(--base-300);
		max-width: fit-content;
		margin: 0 auto;
		padding: 4px;
	}

	.grid-item-small {
		height: 0.75rem;
		width: 0.75rem;
	}

	@media (min-width: 640px) {
		.grid-item-small {
			height: 1rem;
			width: 1rem;
		}
	}

	@media print {
		/* Modify print styles to handle multiple patterns */
		.grid-container {
			page-break-inside: avoid;
		}

		/* When printing all patterns */
		@page {
			size: A4;
			margin: 1cm;
		}

		.print-patterns {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 1cm;
			page-break-inside: avoid;
		}

		.grid-item {
			height: 4rem;
			width: 4rem;
		}
	}
</style>
