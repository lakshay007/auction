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
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-6">My Auctions</h1>

    {#if $auth.isLoggedIn}
      {#if loading}
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      {:else if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <div class="flex">
            <div class="py-1"><AlertCircle class="h-6 w-6 text-red-500 mr-4" /></div>
            <div>
              <p class="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      {:else if auctions.length === 0}
        <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p class="font-bold">No Auctions Found</p>
          <p>You haven't created any auctions yet.</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each auctions as auction (auction._id)}
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">{auction.title}</h2>
                <div class="flex items-center mb-2">
                  <DollarSign class="h-5 w-5 text-gray-500 mr-2" />
                  <span class="text-sm text-gray-600">Starting Bid: ${auction.startingBid.toFixed(2)}</span>
                </div>
                <div class="flex items-center mb-2">
                  <DollarSign class="h-5 w-5 text-gray-500 mr-2" />
                  <span class="text-sm text-gray-600">Minimum Bid: ${auction.minimumBid.toFixed(2)}</span>
                </div>
                <div class="flex items-center mb-2">
                  <Gavel class="h-5 w-5 text-gray-500 mr-2" />
                  <span class={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(auction.status)}`}>
                    {auction.status}
                  </span>
                </div>
                <div class="flex items-center mb-4">
                  <Clock class="h-5 w-5 text-gray-500 mr-2" />
                  <span class="text-sm text-gray-600">Ends: {new Date(auction.endTime).toLocaleString()}</span>
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
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p class="font-bold">Not Logged In</p>
        <p>Please <a href="/login" class="underline">login</a> to view your auctions.</p>
      </div>
    {/if}
  </div>
</div>