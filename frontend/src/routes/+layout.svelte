<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { Gavel, Home, Package, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-svelte';

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement token verification with backend
      // For now, we'll retrieve the username from localStorage
      const username = localStorage.getItem('username');
      if (username) {
        auth.login({ username });
      }
    }
  });

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    auth.logout();
    goto('/');
  }
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <a href="/" class="flex items-center text-xl font-bold text-gray-900">
          <Gavel class="w-6 h-6 mr-2" />
          AuctionHub
        </a>
      </div>
      <div class="flex items-center space-x-4">
        <a href="/" class="text-gray-600 hover:text-gray-900 flex items-center">
          <Home class="w-5 h-5 mr-1" />
          Home
        </a>
        <a href="/auctions" class="text-gray-600 hover:text-gray-900 flex items-center">
          <Package class="w-5 h-5 mr-1" />
          Auctions
        </a>
        {#if $auth.isLoggedIn}
          <a href="/auctions/create" class="text-gray-600 hover:text-gray-900 flex items-center">
            <PlusCircle class="w-5 h-5 mr-1" />
            Create Auction
          </a>
          <a href="/my-auctions" class="text-gray-600 hover:text-gray-900 flex items-center">
            <Package class="w-5 h-5 mr-1" />
            My Auctions
          </a>
          <div class="flex items-center ml-4">
            <span class="text-sm text-gray-700 mr-2">Welcome, {$auth.user.username}</span>
            <button on:click={logout} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
              <LogOut class="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        {:else}
          <a href="/login" class="text-gray-600 hover:text-gray-900 flex items-center">
            <LogIn class="w-5 h-5 mr-1" />
            Login
          </a>
          <a href="/signup" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <UserPlus class="w-4 h-4 mr-1" />
            Signup
          </a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="flex-grow">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>

  <footer class="bg-gray-800 text-white py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; 2023 AuctionHub. All rights reserved.</p>
    </div>
  </footer>
</div>
