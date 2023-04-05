<script>
    import { fade } from "svelte/transition";
    import { scale } from "svelte/transition";

    export let showModal; // boolean
    export let modalTitle = "Modal";
    export let width = "30rem";

    const anim_options = { duration: 200 };
</script>

{#if showModal}
    <div class="backdrop" transition:fade={anim_options}>
        <div
            class="modal_content"
            style="width: {width};"
            transition:scale={anim_options}
        >
            <header class="modal_header">
                <h1>{modalTitle}</h1>
                <!-- svelte-ignore a11y-autofocus -->
                <button
                    autofocus
                    on:click={() => {
                        showModal = false;
                    }}>&#10006;</button
                >
            </header>
            <div class="modal_body">
                <slot name="body" />
            </div>
            <div class="modal_footer">
                <div>
                    <slot name="footer_left" />
                </div>
                <div>
                    <slot name="footer_middle" />
                </div>
                <div>
                    <slot name="footer_right" />
                    <button
                        class="footer_button"
                        on:click={() => {
                            showModal = false;
                        }}>Close</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        vertical-align: middle;
    }
    .modal_content {
        border-radius: 1rem;
        border: none;
        padding: 0;
        background-color: #242424;
        margin: 2rem auto auto;
        padding: 0rem;
        max-height: 90vh;
    }
    .modal_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    .modal_header > h1 {
        margin: 0;
        padding-left: 1rem;
    }
    .modal_header > button {
        border: none;
        background-color: transparent;
        font-size: larger;
    }
    .modal_header > button:hover {
        color: darkred;
    }
    .modal_body {
        display: flex;
        justify-content: left;
        align-items: top;
        padding: 2rem;
        border-top: solid 1px gray;
        border-bottom: solid 1px gray;
        max-height: 55vh;
        overflow: auto;
    }
    .modal_footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }
    .modal_footer > div > button {
        margin: 0 0.5rem;
    }
    .footer_button {
        border: solid darkred;
    }
    .footer_button:hover {
        background-color: darkred;
    }
</style>
