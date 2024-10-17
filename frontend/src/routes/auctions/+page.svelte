<script>
  import { onMount } from 'svelte';
  import { getAuctions } from '$lib/api';
  import { format } from 'date-fns';
  import { fly } from 'svelte/transition';

  let auctions = [];
  let error = '';
  let loading = true;
  let searchTerm = '';

  onMount(async () => {
    try {
      auctions = await getAuctions();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  $: filteredAuctions = auctions.filter(auction => 
    auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getStatusColor(status) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Auctions</h1>

    <div class="mb-6">
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search auctions..."
        class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {#if error}
      <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert" transition:fly="{{ y: -20, duration: 300 }}">
        <p>{error}</p>
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    {:else if filteredAuctions.length === 0}
      <p class="text-center text-gray-700 dark:text-gray-300 text-xl">No auctions found.</p>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredAuctions as auction (auction._id)}
          <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden" transition:fly="{{ y: 20, duration: 300 }}">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{auction.title}</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{auction.description}</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Starting Bid</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">${auction.startingBid.toFixed(2)}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">End Time</span>
                <span class="text-sm text-gray-900 dark:text-gray-300">{format(new Date(auction.endTime), 'PPp')}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                <span class={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(auction.status)}`}>
                  {auction.status}
                </span>
              </div>
              <a
                href="/auctions/{auction._id}"
                class="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                View Auction
              </a>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
