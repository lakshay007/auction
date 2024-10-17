<script>
  import { onMount } from 'svelte';
  import { getMyAuctions } from '$lib/api';
  import { auth } from '$lib/stores/auth';
  import { Gavel, DollarSign, Clock, AlertCircle } from 'lucide-svelte';

  let auctions = [];
  let error = '';
  let loading = true;

  onMount(async () => {
    if ($auth.isLoggedIn) {
      try {
        auctions = await getMyAuctions();
      } catch (err) {
        error = err.message;
      } finally {
        loading = false;
      }
    } else {
      loading = false;
    }
  });

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100';
      case 'closed': return 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
    }
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">My Auctions</h1>

    {#if $auth.isLoggedIn}
      {#if loading}
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      {:else if error}
        <div class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 mb-6" role="alert">
          <div class="flex">
            <div class="py-1"><AlertCircle class="h-6 w-6 text-red-500 dark:text-red-300 mr-4" /></div>
            <div>
              <p class="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      {:else if auctions.length === 0}
        <div class="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 p-4" role="alert">
          <p class="font-bold">No Auctions Found</p>
          <p>You haven't created any auctions yet.</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each auctions as auction (auction._id)}
            <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{auction.title}</h2>
                <div class="flex items-center mb-2">
                  <DollarSign class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">Starting Bid: ${auction.startingBid.toFixed(2)}</span>
                </div>
                <div class="flex items-center mb-2">
                  <DollarSign class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">Minimum Bid: ${auction.minimumBid.toFixed(2)}</span>
                </div>
                <div class="flex items-center mb-2">
                  <Gavel class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span class={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(auction.status)}`}>
                    {auction.status}
                  </span>
                </div>
                <div class="flex items-center mb-4">
                  <Clock class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-300">Ends: {new Date(auction.endTime).toLocaleString()}</span>
                </div>
                <a
                  href="/auctions/{auction._id}"
                  class="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                >
                  View Details
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {:else}
      <div class="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 p-4" role="alert">
        <p class="font-bold">Not Logged In</p>
        <p>Please <a href="/login" class="underline">login</a> to view your auctions.</p>
      </div>
    {/if}
  </div>
</div>
