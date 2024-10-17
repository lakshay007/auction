<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getAuction, placeBid } from '$lib/api';
  import { auth } from '$lib/stores/auth';

  let auction = null;
  let bidAmount = '';
  let error = '';
  let bidPlaced = false;

  onMount(async () => {
    const id = $page.params.id;
    try {
      auction = await getAuction(id);
      bidPlaced = auction.bids && auction.bids.some(bid => bid.bidder === $auth.user.id);
    } catch (err) {
      error = err.message;
    }
  });

  async function handleBid() {
    try {
      await placeBid(auction._id, parseFloat(bidAmount));
      bidPlaced = true;
      error = '';
      // Refresh auction data after placing a bid
      auction = await getAuction(auction._id);
    } catch (err) {
      error = err.message;
    }
  }
</script>

{#if error}
  <p class="error">{error}</p>
{:else if !auction}
  <p>Loading auction...</p>
{:else}
  <h1>{auction.title}</h1>
  <p>{auction.description}</p>
  <p>Type: {auction.type}</p>
  <p>Starting Bid: ${auction.startingBid.toFixed(2)}</p>
  <p>End Time: {new Date(auction.endTime).toLocaleString()}</p>
  <p>Contact: {auction.email}</p>
  <p>Status: {auction.status}</p>
  {#if auction.imageUrl}
    <img src={auction.imageUrl} alt={auction.title} />
  {/if}
  
  {#if auction.status === 'closed'}
    <p>Winning Bid: ${auction.maxBid.toFixed(2)}</p>
  {:else if $auth.isLoggedIn && !bidPlaced}
    <form on:submit|preventDefault={handleBid}>
      <input 
        bind:value={bidAmount} 
        type="number" 
        step="0.01" 
        min={auction.minimumBid} 
        placeholder="Enter bid amount"
        required 
      />
      <button type="submit">Place Bid</button>
    </form>
  {:else if bidPlaced}
    <p>You have already placed a bid on this auction.</p>
  {:else}
    <p>Please <a href="/login">login</a> to place a bid.</p>
  {/if}
  
  {#if $auth.isLoggedIn && auction.creator === $auth.user.id && auction.status === 'closed'}
    <h2>All Bids:</h2>
    <ul>
      {#each auction.bids as bid}
        <li>Bidder: {bid.bidder}, Amount: ${bid.amount.toFixed(2)}</li>
      {/each}
    </ul>
  {/if}
{/if}

<style>
  form {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .error {
    color: red;
  }
  img {
    max-width: 100%;
    height: auto;
  }
</style>
