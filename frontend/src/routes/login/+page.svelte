<script>
  import { goto } from '$app/navigation';
  import { login } from '$lib/api';
  import { auth } from '$lib/stores/auth';
  import { Eye, EyeOff, User, Lock } from 'lucide-svelte';

  let username = '';
  let password = '';
  let error = '';
  let showPassword = false;
  let loginLocked = false;
  let lockTimer = 0;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function startLockTimer() {
    loginLocked = true;
    lockTimer = 60;
    const interval = setInterval(() => {
      lockTimer--;
      if (lockTimer <= 0) {
        loginLocked = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  async function handleSubmit() {
    if (loginLocked) {
      error = `Login locked. Please try again in ${lockTimer} seconds.`;
      return;
    }

    try {
      const { token, user } = await login(username, password);
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      auth.login(user);
      goto('/');
    } catch (err) {
      error = err.message;
      if (err.message === 'Too many login attempts, please try again after 60 seconds') {
        startLockTimer();
      }
    }
  }
</script>

<div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Sign in to your account
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User class="h-5 w-5 text-gray-400" />
            </div>
            <input
              bind:value={username}
              id="username"
              name="username"
              type="text"
              required
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-5 w-5 text-gray-400" />
            </div>
            {#if showPassword}
              <input
                bind:value={password}
                id="password-text"
                name="password"
                type="text"
                required
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
            {:else}
              <input
                bind:value={password}
                id="password-password"
                name="password"
                type="password"
                required
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
            {/if}
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button type="button" on:click={togglePasswordVisibility} class="focus:outline-none">
                {#if showPassword}
                  <EyeOff class="h-5 w-5 text-gray-400" />
                {:else}
                  <Eye class="h-5 w-5 text-gray-400" />
                {/if}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loginLocked}
          >
            Sign in
          </button>
        </div>
      </form>

      {#if error}
        <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{error}</span>
        </div>
      {/if}

      {#if loginLocked}
        <div class="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">Login locked. Please try again in {lockTimer} seconds.</span>
        </div>
      {/if}

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              Don't have an account?
            </span>
          </div>
        </div>

        <div class="mt-6">
          <a
            href="/signup"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
