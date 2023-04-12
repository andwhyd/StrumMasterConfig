<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { slide } from "svelte/transition";

    // Configs
    import { currentConfig } from "../store.js";
    import { pickActions } from "../store.js";
    import { strings } from "../store.js";

    // Modes
    import { modes } from "../store.js";
    import { selMode } from "../store.js";

    export let idx = 0;

    onMount(() => {
        write_config($currentConfig.buttonConfigs[idx]);
    });
    $: $currentConfig, write_config($currentConfig.buttonConfigs[idx]);

    let selAction = 0;
    let selStrings = Array(6).fill(false);

    const update_config = () => {
        let configInt = 0;
        let stringBool = 0;
        for (let j = 0; j < selStrings.length; j++) {
            stringBool = selStrings[j] === true ? 1 : 0;
            configInt += stringBool << j;
        }
        configInt += selAction << 6;
        currentConfig.updateButtonConfig(configInt, idx);
    };

    const write_config = (configInt) => {
        selAction = (configInt >> 6) & 0b11;
        if (configInt < 0 || configInt > 255) {
            console.error("Config int error");
            return;
        }
        for (let j = 0; j < selStrings.length; j++) {
            selStrings[j] = (configInt >> j) & 0b1 ? true : false;
        }
    };
</script>

<div class="input_card" transition:fade={{ duration: 100 }}>
    <div>
        <h1 class="card_header">Input {idx + 1}</h1>
    </div>
    <div>
        <select bind:value={selAction} on:change={update_config}>
            {#each pickActions as pickAction, j}
                <option value={j}>
                    {pickAction}
                </option>
            {/each}
        </select>
        {#each strings as string, j}
            <div class="checkbox">
                <label>
                    <input
                        type="checkbox"
                        bind:checked={selStrings[j]}
                        on:change={update_config}
                    />
                    {"String " + string}
                </label>
            </div>
        {/each}
    </div>
    {#if $selMode == modes.live}
        <div class="live_control" transition:slide>
            <button on:click={() => dispatch("livePlay", { id: idx })}>
                Play
            </button>
        </div>
    {/if}
</div>

<style>
    .input_card {
        border-radius: 0.8rem;
        padding: 1rem 1rem;
        border: solid darkgoldenrod;
        margin: 0.5rem;
        text-align: left;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s;
    }
    .input_card:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }
    .card_header {
        text-align: center;
        margin: 0 0 1rem;
    }
    .live_control {
        margin: 1rem 0rem 0.5rem;
        text-align: center;
    }
    select {
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: large;
    }
    .checkbox {
        font-size: large;
        padding: 0.5rem;
    }
</style>
