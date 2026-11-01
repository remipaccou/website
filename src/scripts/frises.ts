// Every thesis timeline on the page that is not tied to other drawings runs on its own.
import { runFrise } from './frise-core';
document.querySelectorAll<HTMLElement>('.frise:not([data-sync])').forEach(runFrise);
