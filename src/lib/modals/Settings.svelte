<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import Modal from "./Modal.svelte";
    export let showSettings;

    // Button num setting
    import { currentConfig } from "../../store";
    let buttonNum = $currentConfig.buttonNum;
    $: $currentConfig, updateButtonNum();
    const updateButtonNum = () => {
        buttonNum = $currentConfig.buttonNum;
    };

    // Fire delay settings
    let strumDelay = 12;

    // Mode setting
    import { modes } from "../../store";
    import { selMode } from "../../store";
    let selectMode = $selMode.id;

    // Update all settings
    const updateSettings = () => {
        currentConfig.updateButtonNum(buttonNum);
        if (selectMode != $selMode.id) {
            $selMode = modes[Object.keys(modes)[selectMode]];
        }
        dispatch("updateFireDelay", {fireDelay: strumDelay})
        showSettings = false;
    };
</script>

<Modal modalTitle="Settings" bind:showModal={showSettings}>
    <div class="body" slot="body">
        <div class="option">
            <label>
                Number of inputs: {buttonNum}
                <input type="range" min="1" max="12" bind:value={buttonNum} />
            </label>
        </div>
        <div class="option">
            <label>
                Strumming Delay (ms): {strumDelay}
                <input type="range" min="0" max="100" bind:value={strumDelay} />
            </label>
        </div>
        <div class="option">
            <label>
                Select operating mode:
                <select bind:value={selectMode}>
                    {#each Object.keys(modes) as mode}
                        {#if !modes[mode].hidden}
                            <option value={modes[mode].id}>
                                {mode}
                            </option>
                        {/if}
                    {/each}
                </select>
            </label>
        </div>
    </div>
    <button slot="footer_right" on:click={updateSettings}>Save Changes</button>
</Modal>

<style>
    .body {
        text-align: left;
        width: 100%;
    }
    .option {
        padding: 1rem 2rem;
        margin: 0rem -2rem;
        border-bottom: 1px solid gray;
    }
    .body > .option:first-child {
        margin-top: -2rem;
    }
    .body > .option:last-child {
        margin-bottom: -2rem;
        border-bottom: 0px solid gray;
    }
    input {
        width: 100%;
    }
    select {
        font-size: medium;
    }
</style>
