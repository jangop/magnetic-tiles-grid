<!-- src/routes/+page.svelte -->
<script>
    import { browser } from '$app/environment';
    
    let colors = $state({
      red: { count: 10, color: '#FF0000' },
      blue: { count: 10, color: '#0000FF' },
      yellow: { count: 10, color: '#FFD700' },
      green: { count: 10, color: '#008000' }
    });
    
    let rows = $state(4);
    let cols = $state(4);
    let grid = $state([]);
    let symmetry = $state('none'); // 'none', 'mirror', 'rotation'
  
    function generateGrid() {
      let newGrid = Array(rows).fill().map(() => Array(cols).fill(null));
      const availableColors = Object.entries(colors)
        .filter(([_, info]) => info.count > 0)
        .map(([name, _]) => name);
  
      // Basic fill for now - we'll enhance this with symmetry later
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
          newGrid[i][j] = randomColor;
        }
      }
      
      grid = newGrid;
    }
  
    function printGrid() {
      window.print();
    }
  
    // Initialize grid on component mount
    $effect(() => {
      if (browser) {
        generateGrid();
      }
    });
  </script>
  
  <div class="container mx-auto p-4">
    <div class="flex flex-col gap-8">
      <!-- Controls -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Grid Settings</h2>
          <div class="flex gap-4 flex-wrap">
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Rows</span>
              </label>
              <input 
                type="number" 
                bind:value={rows} 
                min="1" 
                max="8"
                class="input input-bordered w-full max-w-xs" 
              />
            </div>
            
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Columns</span>
              </label>
              <input 
                type="number" 
                bind:value={cols} 
                min="1" 
                max="8"
                class="input input-bordered w-full max-w-xs" 
              />
            </div>
  
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Symmetry</span>
              </label>
              <select bind:value={symmetry} class="select select-bordered">
                <option value="none">None</option>
                <option value="mirror">Mirror</option>
                <option value="rotation">Rotation</option>
              </select>
            </div>
          </div>
  
          <div class="flex gap-4 mt-4">
            <button class="btn btn-primary" on:click={generateGrid}>
              Generate New Grid
            </button>
            <button class="btn btn-secondary" on:click={printGrid}>
              Print Grid
            </button>
          </div>
        </div>
      </div>
  
      <!-- Grid Display -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Generated Grid</h2>
          <div class="grid gap-2" style="grid-template-columns: repeat({cols}, minmax(0, 1fr));">
            {#each grid as row, i}
              {#each row as cell, j}
                <div 
                  class="aspect-square border-2 border-base-300"
                  style="background-color: {colors[cell]?.color};"
                ></div>
              {/each}
            {/each}
          </div>
        </div>
      </div>
  
      <!-- Color Inventory -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Available Colors</h2>
          <div class="flex gap-4 flex-wrap">
            {#each Object.entries(colors) as [name, info]}
              <div class="form-control">
                <label class="label">
                  <span class="label-text">{name}</span>
                </label>
                <input 
                  type="number" 
                  bind:value={info.count} 
                  min="0"
                  class="input input-bordered w-24" 
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
      .card {
        box-shadow: none !important;
        background: none !important;
      }
      .card-title {
        display: none;
      }
    }
  </style>