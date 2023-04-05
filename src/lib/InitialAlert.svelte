<script>
    import { slide } from "svelte/transition";
    import { fade } from "svelte/transition";

    const anim_options = { delay: 50, duration: 500 };
    let show = true;
    if (localStorage.getItem("intialAlert") === "false") {
        show = false;
    }
    const closeAlert = () => {
        show = false;
        localStorage.setItem("intialAlert", "false");
    };
</script>

{#if show}
    <div
        class="initalAlert"
        out:slide={{ delay: 0, duration: anim_options.duration }}
    >
        <div out:fade={{ delay: 0, duration: anim_options.delay }}>
            <ul class="disclaimer">
                <li>
                    This configurator uses web bluetooth, IOS devices may not be
                    supported and Chrome is recommended.
                </li>
                <li>
                    Cookies are used by this configurator to store presets,
                    clearing them will delete all presets!
                </li>
                <li>
                    Presets are stored by device, presets can be downloaded and
                    transfered using the preset manager.
                </li>
            </ul>
            <button on:click={closeAlert}> I Understand </button>
        </div>
    </div>
{/if}

<style>
    .disclaimer {
        color: black;
        font-weight: bold;
        text-align: left;
    }
    .initalAlert {
        border-radius: 0.5rem;
        padding: 0.1rem 1rem 1rem;
        border: solid goldenrod;
        background-color: goldenrod;
        margin: 0rem 8rem 1rem;
    }
</style>
