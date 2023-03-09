<script lang="ts">
    let username: string;
    let password: string;

    let error = false;
    let success = false;
    let invalid = false;

    async function submit() {
        error = false;
        success = false;
        invalid = false;
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            error = true;
            return;
        }

        response.json().then((data) => {
            if (data.success) {
                success = true;
            } else if (data.error === 403) {
                invalid = true;
            } else {
                error = true;
            }
        });
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<body class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
            <div class="mb-3">
                <a href="/">Back Home</a>
                <p>Correct login is username: "hello" password: "world"</p>
            </div>
            <form on:submit|preventDefault={submit}>
                <div class="mb-3">
                    <label for="username_input" class="form-label">Username </label>
                    <input
                        id="username_input"
                        name="username"
                        type="text"
                        class="form-control"
                        bind:value={username}
                    />
                </div>

                <div class="mb-3">
                    <label for="password_input" class="form-label"> Password </label>
                    <input
                        id="password_input"
                        name="password"
                        type="password"
                        class="form-control"
                        bind:value={password}
                    />
                </div>

                <button class="btn btn-primary">Login</button>
            </form>
            <div class="mt-3">
                {#if error}
                    <div class="alert alert-danger" role="alert">Error!</div>
                {/if}
                {#if success}
                    <div class="alert alert-success" role="alert">Success!</div>
                {/if}
                {#if invalid}
                    <div class="alert alert-danger" role="alert">Invalid!</div>
                {/if}
            </div>
        </div>
    </div>
</body>
