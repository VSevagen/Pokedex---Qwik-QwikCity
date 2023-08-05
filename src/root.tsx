import {
  component$,
  useSignal,
  useContextProvider,
  createContextId,
  Signal,
  useVisibleTask$
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export const ThemeContext = createContextId<Signal<string>>('light');

export default component$(() => {
  const theme = useSignal('light');
  useContextProvider(ThemeContext, theme);

  useVisibleTask$(({ track }) => {
    track(() => theme.value);
    document.documentElement.className = theme.value;
  }, {strategy: "document-ready"});
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <RouterHead />
        <script type="application/javascript" dangerouslySetInnerHTML={`
          if (window.matchMedia("(prefers-color-scheme: dark)").matches &&
            localStorage.theme !== 'light') {
            localStorage.setItem("theme", 'dark');
          } else {
            localStorage.setItem("theme", 'light');
          }

          document.documentElement.className = localStorage.theme || 'dark';
        `} />
        <ServiceWorkerRegister />
      </head>
      <body lang="en" class={theme.value === 'dark' ? 'dark' : 'light'}>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
