<script>
  import { goto } from '$app/navigation';
  import { createAuction } from '$lib/api';
  import { auth } from '$lib/stores/auth';
  import { Upload, DollarSign, Clock, Mail, Tag, FileText, Image } from 'lucide-svelte';

  let title = '';
  let description = '';
  let type = '';
  let startingBid = '';
  let minimumBid = '';
  let duration = '';
  let email = '';
  let image = null;
  let error = '';
  let imageName = '';

  async function handleSubmit() {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('startingBid', startingBid);
      formData.append('minimumBid', minimumBid);
      formData.append('duration', duration);
      formData.append('email', email);
      if (image) {
        formData.append('image', image);
      }

      const newAuction = await createAuction(formData);
      goto(`/auctions/${newAuction._id}`);
    } catch (err) {
      error = err.message;
    }
  }

  function handleFileInput(event) {
    image = event.target.files[0];
    imageName = image ? image.name : '';
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">Create New Auction</h1>

    {#if $auth.isLoggedIn}
      <form on:submit|preventDefault={handleSubmit} class="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="title">
            Auction Title
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag class="h-5 w-5 text-gray-400" />
            </div>
            <input
              bind:value={title}
              id="title"
              type="text"
              placeholder="Enter auction title"
              required
              class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <FileText class="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              bind:value={description}
              id="description"
              placeholder="Enter auction description"
              required
              class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            ></textarea>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="type">
            Item Type
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag class="h-5 w-5 text-gray-400" />
            </div>
            <input
              bind:value={type}
              id="type"
              type="text"
              placeholder="Enter item type"
              required
              class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div class="flex flex-wrap -mx-3 mb-4">
          <div class="w-full md:w-1/2 px-3 mb-4 md:mb-0">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="startingBid">
              Starting Bid
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign class="h-5 w-5 text-gray-400" />
              </div>
              <input
                bind:value={startingBid}
                id="startingBid"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="minimumBid">
              Minimum Bid
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign class="h-5 w-5 text-gray-400" />
              </div>
              <input
                bind:value={minimumBid}
                id="minimumBid"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="duration">
            Duration
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock class="h-5 w-5 text-gray-400" />
            </div>
            <input
              bind:value={duration}
              id="duration"
              type="text"
              placeholder="HH:MM:SS"
              required
              class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="email">
            Contact Email
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail class="h-5 w-5 text-gray-400" />
            </div>
            <input
              bind:value={email}
              id="email"
              type="email"
              placeholder="Enter contact email"
              required
              class="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="image">
            Upload Image
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Image class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              on:change={handleFileInput}
              class="hidden"
            />
            <label
              for="image"
              class="pl-10 flex items-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
            >
              {imageName || 'Choose an image'}
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <Upload class="h-5 w-5 mr-2" />
            Create Auction
          </button>
        </div>
      </form>

      {#if error}
        <div class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {error}</span>
        </div>
      {/if}
    {:else}
      <div class="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 p-4" role="alert">
        <p class="font-bold">Not Logged In</p>
        <p>Please <a href="/login" class="underline">login</a> to create an auction.</p>
      </div>
    {/if}
  </div>
</div>
