<script>
    import Modal from "./Modal.svelte";
    export let showTutorial;
    import SvelteMarkdown from "svelte-markdown";
    import { fade } from "svelte/transition";
    const anim_options = { delay: 100, duration: 200 };

    let activeTab = 0;

    // Tutorial MD pages and images
    import tutorial1 from "../../assets/tutorial/tutorial1.md?raw";
    import tutorial1Img1 from "../../assets/tutorial/temp.png";
    import tutorial1Img2 from "../../assets/tutorial/temp.png";

    // Tutorial Tabs
    let tabs = [
        { name: "Installation", page: tutorial1, images: [tutorial1Img1, tutorial1Img2] },
        { name: "Page 1", page: tutorial1, images: [tutorial1Img1] },
        { name: "Page 2", page: tutorial1, images: [tutorial1Img1] },
        { name: "Page 3", page: tutorial1, images: [tutorial1Img1] },
        { name: "Page 4", page: tutorial1, images: [tutorial1Img1] },
    ];
</script>

<Modal width={"80rem"} modalTitle="Tutorial" bind:showModal={showTutorial}>
    <div slot="body">
        {#each tabs as tab, j}
            {#if activeTab == j}
                <div
                    class="body"
                    in:fade={anim_options}
                    out:fade={{ duration: anim_options.delay }}
                >
                    <div class="markdown">
                        <SvelteMarkdown source={tab.page} />
                    </div>
                    <div class="images">
                        {#each tab.images as src}
                            <img {src} alt="rip" />
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
    <div slot="footer_middle">
        <button on:click={() => (activeTab -= 1)} disabled={activeTab == 0}
            >&#9664;</button
        >
        <div class="pagination">
            {#each tabs as tab, j}
                <button
                    class={j == activeTab ? "active" : ""}
                    on:click={() => (activeTab = j)}>{tab.name}</button
                >
            {/each}
        </div>
        <button
            on:click={() => (activeTab += 1)}
            disabled={activeTab == tabs.length - 1}>&#9654;</button
        >
    </div>
</Modal>

<style>
    .body {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        text-align: left;
    }
    .markdown {
        display: block;
    }
    .images {
        justify-content: start;
        max-width: 50%;
    }
    img {
        max-width: 100%;
        margin: 1rem 0rem auto;
    }
    .pagination {
        display: inline;
        margin: 0rem 0.5rem;
    }
    .pagination > button {
        font-size: large;
        border-radius: 0;
    }
    .pagination > button.active {
        pointer-events: none;
        background-color: #646cff;
    }
    .pagination > button:not(:last-child) {
        margin-right: 0;
        border-right: none;
    }
    .pagination > button:first-child {
        border-top-left-radius: 0.8rem;
        border-bottom-left-radius: 0.8rem;
    }
    .pagination > button:last-child {
        border-top-right-radius: 0.8rem;
        border-bottom-right-radius: 0.8rem;
    }
</style>
