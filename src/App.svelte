<script>
  // Header
  import Header from "./lib/header/Header.svelte";

  // Bluetooth Stuff
  import BluetoothTerminal from "./lib/bluetooth_terminal";
  import { modes } from "./store.js";
  const terminal = new BluetoothTerminal();
  let connected = false;
  let deviceName = "Unconnected";
  terminal.receive = function (data) {
    logToTerminal(data, "in");
  };
  const logToTerminal = (message, type = "") => {
    console.log(message);
  };
  const connectBluetooth = () => {
    if (connected) {
      terminal.disconnect();
      connected = false;
      deviceName = "Unconnected";
    } else {
      terminal.connect().then(() => {
        deviceName = terminal.getDeviceName()
          ? terminal.getDeviceName()
          : terminal.defaultDeviceName;
        terminal.send("CONNECTING");
        connected = true;
      });
    }
  };
  const applyConfig = () => {
    terminal.send(modes.configuring).then(() => {
      terminal.send(JSON.stringify($currentConfig)).then(() => {
        terminal.send(modes.standard);
      });
    });
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
