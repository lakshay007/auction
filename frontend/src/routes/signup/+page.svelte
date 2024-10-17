<script>
  import { goto } from '$app/navigation';
  import { signup } from '$lib/api';
  import { Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-svelte';

  let username = '';
  let email = '';
  let firstName = '';
  let lastName = '';
  let phoneNumber = '';
  let password = '';
  let error = '';
  let showPassword = false;
  let passwordStrength = 0;

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function checkPasswordStrength(pass) {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    passwordStrength = strength;
  }

  $: {
    checkPasswordStrength(password);
  }

  async function handleSubmit() {
    try {
      await signup(username, email, firstName, lastName, phoneNumber, password);
      goto('/login');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Create your account
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
              id="username"
              name="username"
              type="text"
              required
              bind:value={username}
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              bind:value={email}
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              bind:value={firstName}
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="First Name"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              bind:value={lastName}
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              bind:value={phoneNumber}
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your phone number"
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
                id="password-text"
                name="password"
                type="text"
                required
                bind:value={password}
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
            {:else}
              <input
                id="password-password"
                name="password"
                type="password"
                required
                bind:value={password}
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
          <div class="mt-2">
            <div class="flex justify-between mb-1">
              <span class="text-xs text-gray-500">Password strength:</span>
              <span class="text-xs text-gray-500">
                {#if passwordStrength === 0}
                  Weak
                {:else if passwordStrength === 1}
                  Fair
                {:else if passwordStrength === 2}
                  Good
                {:else if passwordStrength === 3}
                  Strong
                {:else}
                  Very Strong
                {/if}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" style="width: {passwordStrength * 25}%"></div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>
        </div>
      </form>

      {#if error}
        <div class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{error}</span>
        </div>
      {/if}

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        <div class="mt-6">
          <a
            href="/login"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
