<script>
    import { Gavel, Search, TrendingUp } from 'lucide-svelte';
</script>

<div class="bg-white dark:bg-gray-800">
  <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Welcome to EncryBid</h1>
      <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">Discover unique items and bid on exciting auctions!</p>
    </div>
  </div>
</div>

<div class="bg-gray-100 dark:bg-gray-900 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <Search class="h-6 w-6 text-white" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Browse Auctions</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">1000+</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <a href="/auctions" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">View all auctions <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <Gavel class="h-6 w-6 text-white" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Bidders</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">5000+</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <a href="/signup" class="font-medium text-green-600 dark:text-green-400 hover:text-green-500">Join our community <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <TrendingUp class="h-6 w-6 text-white" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Sales</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">$10M+</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <a href="/auctions/create" class="font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-500">Start selling <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
