<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { Gavel, Home, Package, PlusCircle, LogIn, UserPlus, LogOut, Moon, Sun, Shield } from 'lucide-svelte';
  import { darkMode } from '$lib/stores/darkMode';

  let isDarkMode;

  darkMode.subscribe(value => {
    isDarkMode = value;
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

  function toggleDarkMode() {
    darkMode.set(!isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  }

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      if (username) {
        auth.login({ username });
      }
    }

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      darkMode.set(JSON.parse(storedDarkMode));
    }
  });

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    auth.logout();
    goto('/');
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-200">
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <a href="/" class="flex items-center text-xl font-bold text-gray-900 dark:text-white">
          <Gavel class="w-6 h-6 mr-2" />
          EncryBid
        </a>
      </div>
      <div class="flex items-center space-x-4">
        <a href="/" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
          <Home class="w-5 h-5 mr-1" />
          Home
        </a>
        <a href="/auctions" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
          <Package class="w-5 h-5 mr-1" />
          Auctions
        </a>
        {#if $auth.isLoggedIn}
          <a href="/auctions/create" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
            <PlusCircle class="w-5 h-5 mr-1" />
            Create Auction
          </a>
          <a href="/my-auctions" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
            <Package class="w-5 h-5 mr-1" />
            My Auctions
          </a>
          <div class="flex items-center ml-4">
            <span class="text-sm text-gray-700 dark:text-gray-300 mr-2">Welcome, {$auth.user.username}</span>
            <button on:click={logout} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
              <LogOut class="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
          <div class="relative">
            <a
              href="/2fa-setup"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Shield class="h-4 w-4 inline-block mr-2" />
              Setup 2FA
            </a>
          </div>
        {:else}
          <a href="/login" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center">
            <LogIn class="w-5 h-5 mr-1" />
            Login
          </a>
          <a href="/signup" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
            <UserPlus class="w-4 h-4 mr-1" />
            Signup
          </a>
        {/if}
        <button on:click={toggleDarkMode} class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          {#if isDarkMode}
            <Sun class="w-5 h-5" />
          {:else}
            <Moon class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </nav>
  </header>

  <main class="flex-grow">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </div>
  </main>

  <footer class="bg-gray-800 dark:bg-gray-950 text-white py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; 2023 EncryBid. All rights reserved.</p>
    </div>
  </footer>
</div>
