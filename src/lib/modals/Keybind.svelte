<script>
    import Modal from "./Modal.svelte";
    export let showKeybind;
    export let keybind;
    let currentKey = keybind;

    // Update all settings
    const updateSettings = () => {
        keybind = currentKey;
        showKeybind = false;
    };

    const handleKeydown = (event) => {
        currentKey = event.key;
    };
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal modalTitle="Modify Keybind" bind:showModal={showKeybind}>
    <div slot="body">
        <div class="kbd">
            {currentKey}
        </div>
    </div>
    <button slot="footer_right" on:click={updateSettings}>Save Keybind</button>
</Modal>

<style>
    .kbd {
        font-size: xx-large;
        background-color: #eee;
        color: #555;
        border-radius: 0.1rem;
        padding: 0.2rem 1rem;
        border-top: 0.5rem solid rgba(255, 255, 255, 0.5);
        border-left: 0.5rem solid rgba(255, 255, 255, 0.5);
        border-right: 0.5rem solid rgba(0, 0, 0, 0.2);
        border-bottom: 0.5rem solid rgba(0, 0, 0, 0.2);
        text-align: center;
    }
</style>
