<script>
  // Header
  import Header from "./lib/header/Header.svelte";

  // Modes
  import { modes } from "./store.js";
  import { selMode } from "./store.js";

  // Bluetooth Stuff
  import BluetoothTerminal from "./lib/js/BluetoothTerminal";
  const StrumMaster = new BluetoothTerminal();
  let connected = false;
  let deviceName = "Unconnected";
  StrumMaster.receive = function (data) {
    console.log(data);
  };
  $: $selMode, setMode();
  const setMode = async () => {
    StrumMaster.send($selMode.command);
  };
  const connectBluetooth = async () => {
    if (connected) {
      StrumMaster.disconnect();
      connected = false;
      deviceName = "Unconnected";
    } else {
      StrumMaster.connect();
      deviceName = StrumMaster.getDeviceName()
        ? StrumMaster.getDeviceName()
        : StrumMaster.defaultDeviceName;
      StrumMaster.send("CONNECTING");
      connected = true;
    }
  };
  const applyConfig = async () => {
    StrumMaster.send(modes.configuring.command);
    StrumMaster.send(JSON.stringify($currentConfig));
    StrumMaster.send($selMode.command);
  };

  // Intial alert
  import IntialAlert from "./lib/InitialAlert.svelte";

  // Input card
  import InputCard from "./lib/InputCard.svelte";
  import { slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  const anim_options = { delay: 50, duration: 100 };

  // Settings Modal
  import Settings from "./lib/modals/Settings.svelte";
  let showSettings = false;

  // Tutorial Modal
  import Tutorial from "./lib/modals/Tutorial.svelte";
  let showTutorial = false;

  // Presets
  import Presets from "./lib/modals/Presets.svelte";
  let showPresets = false;

  // Curernt Config
  import { currentConfig } from "./store.js";
</script>

<main>
  <Header
    {connected}
    {deviceName}
    on:connect={connectBluetooth}
    on:apply={applyConfig}
    on:settings={() => {
      showSettings = true;
    }}
    on:tutorial={() => {
      showTutorial = true;
    }}
    on:presets={() => {
      showPresets = true;
    }}
  />
  <IntialAlert />

  <div class="input_card_holder" transition:slide={anim_options}>
    {#each { length: $currentConfig.buttonNum } as _, j (j)}
      <div animate:flip={{ duration: anim_options.delay }}>
        <InputCard idx={j} />
      </div>
    {/each}
  </div>
</main>

<Settings bind:showSettings />
<Tutorial bind:showTutorial />
<Presets bind:showPresets />

<style>
  .input_card_holder {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0.1rem;
  }
</style>
