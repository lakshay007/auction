<script>
  import { goto } from '$app/navigation';
  import { signup } from '$lib/api';

  let username = '';
  let password = '';
  let error = '';

  async function handleSubmit() {
    try {
      await signup(username, password);
      goto('/login');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<h1>Sign Up</h1>
<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={username} placeholder="Username" required />
  <input bind:value={password} type="password" placeholder="Password" required />
  <button type="submit">Sign Up</button>
</form>
{#if error}
  <p class="error">{error}</p>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    gap: 1rem;
  }
  .error {
    color: red;
  }
</style>
