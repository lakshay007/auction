<script>
  import { goto } from '$app/navigation';
  import { login } from '$lib/api';
  import { auth } from '$lib/stores/auth';

  let username = '';
  let password = '';
  let error = '';

  async function handleSubmit() {
    try {
      const { token, user } = await login(username, password);
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      auth.login(user);
      goto('/');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={username} placeholder="Username" required />
  <input bind:value={password} type="password" placeholder="Password" required />
  <button type="submit">Login</button>
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
