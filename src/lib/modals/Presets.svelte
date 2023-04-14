<script>
    import Modal from "./Modal.svelte";
    export let showPresets;

    import { savedPresets } from "../../store";
    import { currentConfig } from "../../store";
    import { pickActions } from "../../store.js";
    import { strings } from "../../store.js";

    // Selected config display
    let selPreset = 0;
    $: selConfig = JSON.parse($savedPresets[selPreset].preset);
    const parseConfig = (configInt) => {
        let configString = pickActions[(configInt >> 6) & 0b11];
        let selStrings = [];
        for (let j = 0; j < strings.length; j++) {
            if ((configInt >> j) & 0b1) {
                selStrings.push(strings[j]);
            }
        }
        configString += selStrings.length == 1 ? " string: " : " strings:";
        for (let j = 0; j < selStrings.length; j++) {
            configString += " " + selStrings[j] + ",";
        }
        return configString.replace(/.$/, "");
    };

    // Upload presets
    const uploadPresets = () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
            let reader = new FileReader();
            // @ts-ignore
            reader.readAsBinaryString(e.target.files[0]);
            reader.onload = (e) => {
                // @ts-ignore
                let tempPresets = JSON.parse(e.target.result);
                for (let j = 0; j < tempPresets.length; j++) {
                    savedPresets.addPreset(
                        tempPresets[j].name,
                        JSON.parse(tempPresets[j].preset)
                    );
                }
            };
        };
        input.click();
    };

    // Download presets
    let download = document.createElement("a");
    download.download = "presets.json";
    const downloadPresets = () => {
        let dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify($savedPresets));
        download.href = dataStr;
        download.click();
    };

    // Delete preset
    const deletePreset = () => {
        if (selPreset != 0) {
            selPreset -= 1;
            savedPresets.deletePreset(selPreset + 1);
        }
    };
</script>

<Modal width={"80rem"} modalTitle="Manage Presets" bind:showModal={showPresets}>
    <div class="body" slot="body">
        <div class="presets">
            <h2>Presets:</h2>
            <select bind:value={selPreset} size="2">
                {#each $savedPresets as savedPreset, j}
                    <option value={j}>{savedPreset.name}</option>
                {/each}
            </select>
        </div>
        <div class="preview">
            <h2>Preview:</h2>
            <div class="preset">
                {#each { length: selConfig.buttonNum } as _, j (j)}
                    <p>
                        Button #{j + 1}: {parseConfig(
                            selConfig.buttonConfigs[j]
                        )}
                    </p>
                {/each}
            </div>
        </div>
    </div>
    <div class="group" slot="footer_middle">
        <button
            on:click={() => {
                currentConfig.updateCurrentConfig(selConfig);
                showPresets = false;
            }}>Load Selected Preset</button
        >
        <button class="delete" on:click={deletePreset}>&#128465;</button>
    </div>
    <div class="group" slot="footer_left">
        <button on:click={uploadPresets}>&#128194;</button>
        <button on:click={downloadPresets}>&#128190;</button>
    </div>
</Modal>

<style>
    .group {
        display: flex;
    }
    .group > button {
        font-size: large;
        border-radius: 0;
    }
    .group > button:not(:last-child) {
        margin-right: 0;
        border-right: none;
    }
    .group > button:first-child {
        border-top-left-radius: 0.8rem;
        border-bottom-left-radius: 0.8rem;
    }
    .group > button:last-child {
        border-top-right-radius: 0.8rem;
        border-bottom-right-radius: 0.8rem;
    }
    .delete:hover {
        background-color: darkred;
    }
    .body {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        text-align: left;
    }
    h2 {
        margin: 0;
    }
    .presets {
        margin: 1rem;
        margin-left: 0rem;
    }
    select {
        height: 35vh;
        margin-bottom: 1rem;
    }
    option {
        text-align: left;
        padding: 0.3rem 1rem;
        font-size: medium;
    }
    .preview {
        padding: 0rem;
        margin: 1rem;
        text-align: left;
    }
    .preset > p {
        margin: 0.1rem 0rem;
    }
</style>
