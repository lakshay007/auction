<script>
    import { Gavel, Search, TrendingUp } from 'lucide-svelte';
  </script>
  
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Welcome to AuctionHub</h1>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">Discover unique items and bid on exciting auctions!</p>
      </div>
    </div>
  </div>
  
  <div class="bg-gray-100 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Search class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Browse Auctions</dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">1000+</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <a href="/auctions" class="font-medium text-blue-600 hover:text-blue-500">View all auctions <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </div>
  
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Gavel class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Bidders</dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">5000+</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <a href="/signup" class="font-medium text-green-600 hover:text-green-500">Join our community <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </div>
  
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <TrendingUp class="h-6 w-6 text-white" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">$10M+</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <a href="/auctions/create" class="font-medium text-yellow-600 hover:text-yellow-500">Start selling <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>