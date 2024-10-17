<script>
  import { goto } from '$app/navigation';
  import { createAuction } from '$lib/api';
  import { auth } from '$lib/stores/auth';

  let title = '';
  let description = '';
  let type = '';
  let startingBid = '';
  let minimumBid = '';
  let duration = ''; 
  let email = '';
  let image = null;
  let error = '';

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
  }
</script>

<h1>Create New Auction</h1>

{#if $auth.isLoggedIn}
  <form on:submit|preventDefault={handleSubmit}>
    <input bind:value={title} placeholder="Auction Title" required />
    <textarea bind:value={description} placeholder="Description" required></textarea>
    <input bind:value={type} placeholder="Item Type" required />
    <input bind:value={startingBid} type="number" step="0.01" placeholder="Starting Bid" required />
    <input bind:value={minimumBid} type="number" step="0.01" placeholder="Minimum Bid" required />
    <input bind:value={duration} type="text" placeholder="Duration (HH:MM:SS)" required />
    <input bind:value={email} type="email" placeholder="Contact Email" required />
    <input type="file" accept="image/*" on:change={handleFileInput} />
    <button type="submit">Create Auction</button>
  </form>
  {#if error}
    <p class="error">{error}</p>
  {/if}
{:else}
  <p>Please <a href="/login">login</a> to create an auction.</p>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }
  .error {
    color: red;
  }
</style>
