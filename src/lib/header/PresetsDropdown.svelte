<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import { savedPresets } from "../../store";
    import { currentConfig } from "../../store";
    let saveName = "";
    const savePreset = () => {
        if (saveName !== "") {
            savedPresets.addPreset(saveName, $currentConfig);
            saveName = "";
        }
    };
</script>

<div class="dropdown">
    <button class="presets">
        <div style="margin-right:1rem;">Presets</div>
        <div>&#9660;</div>
    </button>
    <div class="dropdown_content">
        <input bind:value={saveName} />
        <button on:click={savePreset}>Save Preset</button>
        <div style="margin:0.2rem 0rem;border-bottom: inherit" />
        <button
            on:click={() => {
                dispatch("presets");
            }}>Load/Manage Presets</button
        >
        <button on:click={() => localStorage.clear()}
            >DEV: Clear Local Storage
        </button>
    </div>
</div>

<style>
    input {
        padding: 0.2rem 0.5rem;
        margin: 0rem 1rem 0.5rem;
    }
    button {
        font-size: large;
    }
    .presets {
        display: inline-flex;
        justify-content: space-between;
        margin: 0;
    }
    .dropdown {
        position: relative;
        display: inline-block;
    }
    .dropdown_content {
        display: none;
        position: absolute;
        border-radius: 0.8rem;
        border: solid #646cff;
        background-color: #303030;
        width: auto;
        z-index: 1;
        padding: 1rem 0rem 0rem;
    }
    .dropdown:hover .dropdown_content {
        display: block;
    }
    .dropdown_content > button {
        background-color: inherit;
        border: none;
        border-radius: 0px;
        display: flex;
        font-size: medium;
        margin: 0rem;
        padding: 0.5rem 0.5rem;
        width: 100%;
        white-space: nowrap;
    }
    .dropdown_content > button:last-child {
        border-bottom-left-radius: 0.8rem;
        border-bottom-right-radius: 0.8rem;
    }
    .dropdown_content > button:hover {
        background-color: #646cff;
    }
</style>
