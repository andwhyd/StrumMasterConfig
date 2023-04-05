<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { currentConfig } from "../store.js";

    import { pickActions } from "../store.js";
    import { strings } from "../store.js";

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

<div class="input-card" transition:fade={{ duration: 100 }}>
    <div>
        <h4 class="card-header">Input {idx + 1}</h4>
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
            <div>
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
</div>

<style>
    .input-card {
        border-radius: 0.8rem;
        padding: 1rem 2rem;
        border: solid darkgoldenrod;
        margin: 0.5rem;
        text-align: left;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
    }
    .input-card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
    .card-header {
        text-align: center;
        margin: 0 0 1rem;
    }
</style>
