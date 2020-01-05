const DEFAULT_COLORSCHEME = {
    BACKGROUND: '#000000',
    FOREGROUND: '#ffffff',
    BACKGROUND_LIGHT: '#222222',
    ACCENT_PRIMARY: '#f7022f',
    ACCENT_SECONDARY: '#cc0227',
    TEXT: '#ffffff'
};

const versionLabel = document.getElementById('version');
const restartBanner = document.getElementById('banner');
const updateButton = document.getElementById('update');
const resetButton = document.getElementById('reset');
const outputArea = document.getElementById('output');

// Colorpicker dialog
const colorpickerDialogOverlay = document.getElementById('overlay');
const colorpickerDialog = document.getElementById('colorpicker-dialog');
const colorpickerDialogInput = document.getElementById('colorpicker-dialog-input');
const colorpickerDialogDiscard = document.getElementById('colorpicker-dialog-discard');

const toggleButtons = Array.from(document.getElementsByClassName('toggle'));
const colorPreviews = Array.from(document.getElementsByClassName('colorpicker-dialog-open'));
const pywalColorPreviews = Array.from(document.getElementsByClassName('pywal-color'));

var restartBannerTimeout = null;
var currentDialogTarget = undefined;
var currentDialogEditColor = undefined;
var currentDialogSelectedColor = undefined;
var currentDialogResetColor = undefined;
var currentExtensionColors = {};
var pywalColors = {};

// Get the colors that we want to apply to the Settings page
function getExtensionColorsFromTheme(theme) {
    return {
        background: theme.colors ? theme.colors.frame : DEFAULT_COLORSCHEME.BACKGROUND,
        foreground: theme.colors ? theme.colors.tab_selected : DEFAULT_COLORSCHEME.FOREGROUND,
        backgroundLight: theme.colors ? theme.colors.button_background_hover : DEFAULT_COLORSCHEME.BACKGROUND_LIGHT,
        accentPrimary: theme.colors ? theme.colors.tab_loading : DEFAULT_COLORSCHEME.ACCENT_PRIMARY,
        accentSecondary: theme.colors ? theme.colors.popup_highlight : DEFAULT_COLORSCHEME.ACCENT_SECONDARY,
        text: theme.colors ? theme.colors.toolbar_field_text : DEFAULT_COLORSCHEME.TEXT
    };
}

// Update the CSS-variables in the Settings page to dynamically change the theme
// off the page based on the current selected colors
function setExtensionTheme(extensionColors) {
    document.documentElement.style.setProperty('--background', extensionColors.background);
    document.documentElement.style.setProperty('--background-light', extensionColors.backgroundLight);
    document.documentElement.style.setProperty('--foreground', extensionColors.foreground);
    document.documentElement.style.setProperty('--accent-primary', extensionColors.accentPrimary);
    document.documentElement.style.setProperty('--accent-secondary', extensionColors.accentSecondary);
    document.documentElement.style.setProperty('--text-color', extensionColors.text);
}

// Notification-like message
function showBanner(message) {
    if (restartBannerTimeout === null) {
        banner.innerText = message;
        banner.classList.add('show');
        restartBannerTimeout = setTimeout(() => {
            banner.classList.remove('show');
            restartBannerTimeout = null;
        }, 3000);
    }
}

// Gets a color generated by pywal
function getPywalColorById(id) {
    return pywalColors[id];
}

function output(message) {
    outputArea.value += message + '\n';
    outputArea.scrollTop = outputArea.scrollHeight; // Scrolls to bottom of textarea
}

async function sendMessageToTabs(data) {
    const tabs = await browser.tabs.query({});

    for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, data);
    }
}

async function toggleOption(e) {
    const action = e.target.getAttribute('data-action');
    const state = await browser.storage.local.get(action);
    let updatedValue = state[action] ? false : true;

    if (action == 'customCssEnabled' || action == 'noScrollbarEnabled') {
        showBanner('Restart needed for custom CSS to take effect!');
        browser.runtime.sendMessage({ action: action, enabled: updatedValue });
    } else if (action == 'ddgThemeEnabled') {
        sendMessageToTabs({ action: action, enabled: updatedValue });
    }

    browser.storage.local.set({ [action]: updatedValue });

    e.target.innerText = updatedValue ? 'On' : 'Off';
    e.target.classList.toggle('enabled');
}

function setCustomColor(colorKey, color, ddgReload = true) {
    browser.runtime.sendMessage({
        action: 'customColor',
        type: colorKey,
        value: color,
        ddgReload: ddgReload
    });
}

function showDialogOverlay() {
    colorpickerDialogOverlay.style.display = 'flex';
}

function hideDialogOverlay() {
    colorpickerDialogOverlay.style.display = 'none';
}

function openColorpickerDialog(e) {
    const targetColor = e.target.getAttribute('data-color-key');
    const currentColor = currentExtensionColors[targetColor];

    if (currentDialogTarget === undefined) {
        showDialogOverlay();

        document.body.classList.add('dialog-open');
        colorpickerDialog.style.display = 'flex';
    } else {
        currentDialogTarget.classList.remove('selected');
    }

    currentDialogTarget = e.target;
    currentDialogEditColor = targetColor;
    currentDialogResetColor = currentColor;

    currentDialogTarget.classList.add('selected');
    colorpickerDialogInput.setAttribute('data-color', targetColor);
}

function closeDialog(dialog) {
    hideDialogOverlay();
    document.body.classList.remove('dialog-open');
    currentDialogTarget.classList.remove('selected');
    currentDialogTarget = undefined;
    currentDialogEditColor = undefined;
    currentDialogResetColor = undefined;
    currentDialogSelectedColor = undefined;
    dialog.style.display = 'none';
}

function onSetPywalColorAsCustomColor(e) {
    const newColor = getPywalColorById(e.target.getAttribute('data-id'));
    currentDialogSelectedColor = newColor;
    setCustomColor(currentDialogEditColor, newColor, false);
}

function onCustomColorInputChanged(e) {
    const newColor = e.target.value;
    currentDialogSelectedColor = newColor;
    setCustomColor(currentDialogEditColor, newColor, false);
}

function hasADifferentColorBeenChosen() {
    if (currentDialogSelectedColor !== undefined && currentDialogSelectedColor !== currentDialogResetColor) {
        return true;
    }

    return false;
}

async function onColorpickerDialogClose(e) {
    if (hasADifferentColorBeenChosen()) {
        const state = await browser.storage.local.get('pywalColors');
        pywalColors = state.pywalColors;
        sendMessageToTabs({ action: 'updateDDGTheme' });
    }

    closeDialog(colorpickerDialog);
}

function onColorpickerDialogDiscard(e) {
    if (hasADifferentColorBeenChosen()) {
        setCustomColor(currentDialogEditColor, currentDialogResetColor, false);
    }

    closeDialog(colorpickerDialog);
}

updateButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'update' });
});

resetButton.addEventListener('click', () => {
    onExtensionLoad();
    browser.runtime.sendMessage({ action: 'reset' });
});

toggleButtons.forEach((toggleButton) => {
    toggleButton.addEventListener('click', toggleOption);
});

colorPreviews.forEach((preview) => {
    preview.addEventListener('click', openColorpickerDialog);
});

colorpickerDialogInput.addEventListener('change', onCustomColorInputChanged);
colorpickerDialogOverlay.addEventListener('click', onColorpickerDialogClose);
colorpickerDialogDiscard.addEventListener('click', onColorpickerDialogDiscard);

// Watch for theme updates
browser.theme.onUpdated.addListener(async ({ theme, windowId }) => {
    const sidebarWindow = await browser.windows.getCurrent();
    if (!windowId || windowId == sidebarWindow.id) {
        output('Theme was updated');
        onExtensionLoad();
    }
});

// Listen for messages from background script
browser.runtime.onMessage.addListener((response) => {
    if (response.action == 'output') {
        output(response.message);
    }
});

// Sets the theme of the extension to match the one in the browser
async function onExtensionLoad() {
    const theme = await browser.theme.getCurrent();
    const colors = getExtensionColorsFromTheme(theme);
    const gettingPywalColors = await browser.storage.local.get('pywalColors');
    setExtensionTheme(colors);

    currentExtensionColors = colors;
    pywalColors = gettingPywalColors.pywalColors;

    // Set the default values for the color pickers
    colorPreviews.forEach((preview) => {
        preview.style.backgroundColor = colors[preview.getAttribute('data-color-key')];
    });

    toggleButtons.forEach(async (toggleButton) => {
        const action = toggleButton.getAttribute('data-action');
        const state = await browser.storage.local.get(action);
        if (state[action] == true) {
            toggleButton.classList.add('enabled');
            toggleButton.innerText = 'On';
        }
    });
}

// Updates extension colors, updates the current value of settings, etc
onExtensionLoad().then(() => {
    pywalColorPreviews.forEach((preview) => {
        const id = preview.getAttribute('data-id');
        preview.style.backgroundColor = getPywalColorById(id);
        preview.addEventListener('click', onSetPywalColorAsCustomColor);
    });
});

versionLabel.innerText = `v${browser.runtime.getManifest().version}`;



