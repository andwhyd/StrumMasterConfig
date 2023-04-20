import { writable } from "svelte/store";

export const pickActions = [
    "Pick",
    "Strum Up",
    "Strum Down",
];
export const strings = [
    "E H",
    "A",
    "D",
    "G",
    "B",
    "E L",
];
export const modes = {
    configuring: { id: 0, command: "MODE:00", hidden: true },
    controller: { id: 1, command: "MODE:01", hidden: false },
    serial: { id: 2, command: "MODE:02", hidden: false },
    keyboard: { id: 3, command: "MODE:03", hidden: false },
    error: { id: 99, command: "MODE:99", hidden: true },
};
export const selMode = writable(modes.controller);

const updateButtonNum = (config, num) => {
    config.buttonNum = num;
    localStorage.setItem("savedCurrentConfig", JSON.stringify(config));
    return config;
}
const updateButtonConfig = (config, num, idx) => {
    config.buttonConfigs[idx] = num;
    localStorage.setItem("savedCurrentConfig", JSON.stringify(config));
    return config;
}
const updateCurrentConfig = (config, newConfig) => {
    config.buttonNum = newConfig.buttonNum;
    for (let j = 0; j < newConfig.buttonNum; j++) {
        config.buttonConfigs[j] = newConfig.buttonConfigs[j];
    }
    localStorage.setItem("savedCurrentConfig", JSON.stringify(config));
    return config;
}
const createCurrentConfig = () => {
    let savedConfig = JSON.parse(
        localStorage.getItem("savedCurrentConfig"));
    if (savedConfig === null) {
        savedConfig = {
            "buttonNum": 6,
            "buttonConfigs": Array(12).fill(0)
        };
    }
    console.log(savedConfig)
    const { subscribe, set, update } = writable(savedConfig);

    return {
        subscribe,
        updateButtonNum: (num) => update(n => updateButtonNum(n, num)),
        updateButtonConfig: (num, idx) => update(n => updateButtonConfig(n, num, idx)),
        updateCurrentConfig: (newConfig) => update(n => updateCurrentConfig(n, newConfig))
    };
}
export let currentConfig = createCurrentConfig()

const addPreset = (presets, name, config) => {
    let alreadyNamed = false
    for (let j = 0; j < presets.length; j++) {
        if (presets[j].name === name) {
            presets[j] = {
                "name": name,
                "preset": JSON.stringify(config),
            }
            alreadyNamed = true;
            break;
        }
    }
    if (alreadyNamed == false) {
        presets.push({
            "name": name,
            "preset": JSON.stringify(config),
        });
    }
    localStorage.setItem("savedPresets", JSON.stringify(presets));
    return presets;
}
const deletePreset = (presets, idx) => {
    presets.splice(idx, 1);
    localStorage.setItem("savedPresets", JSON.stringify(presets));
    return presets;
}
const createSavedPresets = () => {
    let savedPresets = JSON.parse(
        localStorage.getItem("savedPresets"));
    if (savedPresets === null) {
        savedPresets = [{ name: "Simple Pick (Example)", preset: JSON.stringify({ buttonNum: 6, buttonConfigs: [1, 2, 4, 8, 16, 32] }) }];
    }
    console.log(savedPresets)
    const { subscribe, set, update } = writable(savedPresets);

    return {
        subscribe,
        addPreset: (name, config) => update(n => addPreset(n, name, config)),
        deletePreset: (idx) => update(n => deletePreset(n, idx)),
    };
}
export let savedPresets = createSavedPresets();


