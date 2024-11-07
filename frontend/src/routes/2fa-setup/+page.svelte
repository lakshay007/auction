<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { generate2FA, verify2FA } from '$lib/api';
  import { auth } from '$lib/stores/auth';
  import { Shield, Check } from 'lucide-svelte';

  let qrCode = '';
  let secret = '';
  let verificationCode = '';
  let error = '';
  let success = '';

  onMount(async () => {
    if (!$auth.isLoggedIn) {
      goto('/login');
      return;
    }

    try {
      const response = await generate2FA();
      qrCode = response.qrCode;
      secret = response.secret;
    } catch (err) {
      error = err.message;
    }
  });

  async function handleVerify() {
    try {
      await verify2FA(verificationCode);
      success = '2FA enabled successfully!';
      setTimeout(() => goto('/'), 2000);
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8">
      <Shield class="mx-auto h-12 w-12 text-blue-500" />
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        Set Up Two-Factor Authentication
      </h2>
    </div>

    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
      {#if qrCode}
        <div class="text-center mb-6">
          <img src={qrCode} alt="2FA QR Code" class="mx-auto mb-4" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Scan this QR code with your authenticator app
          </p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            bind:value={verificationCode}
            placeholder="Enter 6-digit code"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          on:click={handleVerify}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Check class="h-5 w-5 mr-2" />
          Verify and Enable 2FA
        </button>
      {/if}

      {#if error}
        <div class="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      {/if}

      {#if success}
        <div class="mt-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded">
          {success}
        </div>
      {/if}
    </div>
  </div>
</div> 