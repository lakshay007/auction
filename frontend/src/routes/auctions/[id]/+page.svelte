<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getAuction, placeBid } from '$lib/api';
  import { auth } from '$lib/stores/auth';
  import { format } from 'date-fns';
  import { fly } from 'svelte/transition';
  import { Gavel, DollarSign, Clock, Mail, AlertCircle } from 'lucide-svelte';

  let auction = null;
  let bidAmount = '';
  let error = '';
  let success = '';
  let bidPlaced = false;
  let showAllBids = false;

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
      success = 'Bid placed successfully!';
      // Refresh auction data after placing a bid
      auction = await getAuction(auction._id);
      bidAmount = '';
    } catch (err) {
      error = err.message;
      success = '';
    }
  }

  function toggleAllBids() {
    showAllBids = !showAllBids;
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    {#if error}
      <div class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 mb-6" role="alert" transition:fly="{{ y: -20, duration: 300 }}">
        <div class="flex">
          <AlertCircle class="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    {/if}

    {#if success}
      <div class="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-700 dark:text-green-300 p-4 mb-6" role="alert" transition:fly="{{ y: -20, duration: 300 }}">
        <div class="flex">
          <Gavel class="h-5 w-5 mr-2" />
          <span>{success}</span>
        </div>
      </div>
    {/if}

    {#if !auction}
      <div class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p class="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading auction...</p>
      </div>
    {:else}
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        {#if auction.imageUrl}
          <img src={auction.imageUrl} alt={auction.title} class="w-full h-64 object-cover object-center" />
        {/if}
        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{auction.title}</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{auction.description}</p>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{auction.type}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Starting Bid</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">${auction.startingBid.toFixed(2)}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">End Time</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{format(new Date(auction.endTime), 'PPp')}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{auction.email}</p>
            </div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">Status: <span class="text-blue-600 dark:text-blue-400">{auction.status}</span></p>
            {#if auction.status === 'closed'}
              <p class="text-lg font-semibold text-gray-900 dark:text-white mt-2">Winning Bid: <span class="text-green-600 dark:text-green-400">${auction.maxBid.toFixed(2)}</span></p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white mt-2">Winning Bidder: <span class="text-green-600 dark:text-green-400">{auction.winningBidder}</span></p>
            {/if}
          </div>
          
          {#if auction.status === 'closed'}
            {#if $auth.isLoggedIn && auction.creator === $auth.user.id}
              <button on:click={toggleAllBids} class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                {showAllBids ? 'Hide All Bids' : 'Show All Bids'}
              </button>
            {/if}
          {:else if $auth.isLoggedIn && !bidPlaced}
            <form on:submit|preventDefault={handleBid} class="mt-6">
              <div class="flex items-center border-b border-blue-500 dark:border-blue-400 py-2">
                <input 
                  bind:value={bidAmount} 
                  type="number" 
                  step="0.01" 
                  min={auction.minimumBid} 
                  placeholder="Enter bid amount"
                  required 
                  class="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
                />
                <button type="submit" class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded">
                  Place Bid
                </button>
              </div>
            </form>
          {:else if bidPlaced}
            <p class="text-lg font-semibold text-green-600 dark:text-green-400">You have already placed a bid on this auction.</p>
          {:else}
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Please <a href="/login" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">login</a> to place a bid.</p>
          {/if}
        </div>
      </div>

      {#if showAllBids}
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div class="mt-3 text-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">All Bids</h3>
              <div class="mt-2 px-7 py-3">
                <ul class="space-y-2">
                  {#each auction.bids as bid}
                    <li class="text-sm text-gray-500 dark:text-gray-400">
                      Bidder: {bid.bidderUsername}, Amount: ${bid.amount.toFixed(2)}
                    </li>
                  {/each}
                </ul>
              </div>
              <div class="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  on:click={toggleAllBids}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
