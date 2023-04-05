<script>
    import Modal from "./Modal.svelte";
    export let showSettings;

    // Button num setting
    import { currentConfig } from "../../store";
    let buttonNum = $currentConfig.buttonNum;
    $: $currentConfig, updateButtonNum();
    const updateButtonNum = () => {
        buttonNum = $currentConfig.buttonNum;
    };

    // Update all settings
    const updateSettings = () => {
        currentConfig.updateButtonNum(buttonNum);
    };
</script>

<Modal modalTitle="Settings" bind:showModal={showSettings}>
    <label slot="body">
        Number of inputs: {buttonNum}
        <input type="range" min="1" max="12" bind:value={buttonNum} />
    </label>
    <button slot="footer_right" on:click={updateSettings}>Save Changes</button>
</Modal>

<style>
    label {
        text-align: left;
        width: 100%;
    }
    input {
        width: 100%;
    }
</style>
