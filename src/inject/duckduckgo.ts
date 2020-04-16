import { EXTENSION_MESSAGES } from '../config';
import { IDuckDuckGoTheme } from '../colorscheme';
import { setupExtensionMessageListener, DDG, IExtensionMessage } from '../messenger';

function getCurrentTheme() {
  return window.wrappedJSObject.DDG.settings.get('kae');
}

function resetTheme() {
  console.debug('Resetting theme');
  window.wrappedJSObject.DDG.settings.setTheme('d');
}

function applyTheme(theme: IDuckDuckGoTheme) {
  console.debug('Applying Pywalfox theme');
  for (const color of theme) {
    window.wrappedJSObject.DDG.settings.set(`k${color.id}`, color.value, { saveToCookie: true });
  }
}

function onMessage(message: IExtensionMessage) {
  switch (message.action) {
    case EXTENSION_MESSAGES.DDG_THEME_ENABLED:
      const theme = message.data;
      theme && applyTheme(theme);
      break;
    case EXTENSION_MESSAGES.DDG_THEME_DISABLED:
      if (getCurrentTheme() === 'pywalfox') {
        resetTheme();
      }
    default:
      console.error(`Received unhandled action: ${message.action}`);
  }
}

function load() {
  console.debug('Pywalfox content script loaded');
  setupExtensionMessageListener(onMessage);
  DDG.requestTheme();
}

load();





