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
    export let keybind = "" + (idx + 1);
    switch (idx) {
        case 10 - 1:
            keybind = "0";
            break;
        case 11 - 1:
            keybind = "-";
            break;
        case 12 - 1:
            keybind = "=";
            break;
    }

    // Keybinds
    import Keybind from "./modals/Keybind.svelte";
    let showKeybind = false;

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

    const handleKeydown = (event) => {
        if ($selMode == modes.live && event.key === keybind) {
            dispatch("livePlay", { id: idx });
        }
    };
</script>

<svelte:window on:keydown={handleKeydown} />

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
        <div class="checkbox">
            {#each strings as string, j}
                <label>
                    <input
                        type="checkbox"
                        bind:checked={selStrings[j]}
                        on:change={update_config}
                    />
                    {"String " + string}
                </label>
            {/each}
        </div>
    </div>
    {#if $selMode == modes.live}
        <div class="live_control" transition:slide>
            <button on:click={() => dispatch("livePlay", { id: idx })}>
                Play
            </button>
            <button
                class="kbd"
                on:click={() => {
                    showKeybind = true;
                }}>{keybind}</button
            >
        </div>
    {/if}
</div>

<Keybind bind:showKeybind bind:keybind />

<style>
    .input_card {
        border-radius: 0.8rem;
        padding: 1rem 1rem;
        border: solid darkgoldenrod;
        margin: 0.5rem;
        text-align: left;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s;
        min-width: 12vw;
    }
    .input_card:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.4);
    }
    .card_header {
        text-align: center;
        margin: 0 0 1rem;
    }
    .live_control {
        display: flex;
        justify-content: space-evenly;
        margin: 1rem 0rem 0.5rem;
        text-align: center;
    }
    select {
        border-radius: 0.8rem;
        padding: 0.5rem;
        margin-bottom: 1rem;
        font-size: large;
        width: 100%;
    }
    .checkbox {
        border-radius: 0.8rem;
        border-bottom: 1px solid gray;
    }
    .checkbox > label:first-child {
        border-top-left-radius: 0.8rem;
        border-top-right-radius: 0.8rem;
    }
    .checkbox > label:last-child {
        border-bottom-left-radius: 0.8rem;
        border-bottom-right-radius: 0.8rem;
    }
    label {
        display: block;
        font-size: large;
        padding: 0.5rem;
        border: 1px solid gray;
        border-bottom: 0px;
    }
    .kbd {
        background-color: #eee;
        color: #555;
        border-radius: 0.1rem;
        padding: 0.2rem 0.6rem;
        border-top: 0.5rem solid rgba(255, 255, 255, 0.5);
        border-left: 0.5rem solid rgba(255, 255, 255, 0.5);
        border-right: 0.5rem solid rgba(0, 0, 0, 0.2);
        border-bottom: 0.5rem solid rgba(0, 0, 0, 0.2);
        text-align: center;
    }
</style>
