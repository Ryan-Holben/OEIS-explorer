/**
 * Application configuration
 * Reads from app.config.json at build time
 */

import appConfig from '../../../app.config.json';

export const APP_NAME = appConfig.name;
export const APP_DESCRIPTION = appConfig.description;
export const APP_VERSION = appConfig.version;

export default appConfig;
