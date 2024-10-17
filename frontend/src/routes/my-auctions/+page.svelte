<script>
  import { onMount } from 'svelte';
  import { getMyAuctions } from '$lib/api';
  import { auth } from '$lib/stores/auth';

  let auctions = [];
  let error = '';

  onMount(async () => {
    if ($auth.isLoggedIn) {
      try {
        auctions = await getMyAuctions();
      } catch (err) {
        error = err.message;
      }
    }
  });
</script>

<h1>My Auctions</h1>

{#if $auth.isLoggedIn}
  {#if error}
    <p class="error">{error}</p>
  {:else if auctions.length === 0}
    <p>You haven't created any auctions yet.</p>
  {:else}
    <div class="auctions-grid">
      {#each auctions as auction}
        <div class="auction-card">
          <h2>{auction.title}</h2>
          <p>Starting Bid: ${auction.startingBid.toFixed(2)}</p>
          <p>Minimum Bid: ${auction.minimumBid.toFixed(2)}</p>
          <p>Status: {auction.status}</p>
          <p>End Time: {new Date(auction.endTime).toLocaleString()}</p>
          <a href="/auctions/{auction._id}">View Details</a>
        </div>
      {/each}
    </div>
  {/if}
{:else}
  <p>Please <a href="/login">login</a> to view your auctions.</p>
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
