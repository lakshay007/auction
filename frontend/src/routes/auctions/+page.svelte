<script>
  import { onMount } from 'svelte';
  import { getAuctions } from '$lib/api';

  let auctions = [];
  let error = '';

  onMount(async () => {
    try {
      auctions = await getAuctions();
    } catch (err) {
      error = err.message;
    }
  });
</script>

<h1>Auctions</h1>
{#if error}
  <p class="error">{error}</p>
{:else if auctions.length === 0}
  <p>Loading auctions...</p>
{:else}
  <div class="auctions-grid">
    {#each auctions as auction}
      <div class="auction-card">
        <h2>{auction.title}</h2>
        {#if auction.minimumBid}
          <p>Minimum Bid: ${auction.minimumBid.toFixed(2)}</p>
        {/if}
        <a href="/auctions/{auction._id}">View Auction</a>
      </div>
    {/each}
  </div>
{/if}

<style>
  .auctions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  .auction-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 4px;
  }
  .error {
    color: red;
  }
</style>
