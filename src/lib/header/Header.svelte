<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import PresetsDropdown from "./PresetsDropdown.svelte";

  export let connected;
  export let deviceName;
</script>

<header>
  <h1 class="logo">StrumMaster Configurator</h1>
  <div class="button_holder">
    <button
      class={connected ? "disconnect" : "connect"}
      on:click={() => {
        dispatch("connect");
      }}
    >
      {connected ? "Disconnect" : "Connect"}
    </button>
    <button
      class="apply "
      disabled={!connected}
      on:click={() => {
        dispatch("apply");
      }}
    >
      Apply
    </button>
    <PresetsDropdown on:presets on:savePreset />
    <button
      class="settings"
      on:click={() => {
        dispatch("settings");
      }}
    >
      Settings
    </button>
    <!-- <button
      class="tutorial"
      on:click={() => {
        dispatch("tutorial");
      }}
    >
      Tutorial
    </button> -->
  </div>
  <div class="button_holder">
    <button
      class={connected ? "status_connected" : "status_disconnnected"}
      on:click={() => {}}
    >
      Device: {deviceName}
    </button>
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    width: 100%;
    margin: 0 0 1rem;
    background-color: #181818;
    display: flex;
    flex-wrap: wrap;
    vertical-align: middle;
    justify-content: space-around;
  }
  .logo {
    margin: 0;
    padding: 1rem;
  }
  .button_holder {
    display: inline;
    margin: 1rem 0.5rem;
  }
  button {
    font-size: large;
  }
  .connect {
    width: 8rem;
    border: solid darkgreen;
  }
  .connect:hover {
    background-color: darkgreen;
  }
  .disconnect {
    width: 8rem;
    border: solid darkred;
  }
  .disconnect:hover {
    background-color: darkred;
  }
  .status_connected {
    width: 15rem;
    pointer-events: none;
    background-color: darkgreen;
    border: solid darkgreen;
  }
  .status_disconnnected {
    width: 15rem;
    pointer-events: none;
    background-color: gold;
    border: solid gold;
    color: black;
  }
</style>
