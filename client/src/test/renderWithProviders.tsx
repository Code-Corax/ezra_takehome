import type { PropsWithChildren, ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "styled-components";

import { rootReducer, type RootState } from "../app/store";
import themes from "../app/utils/themes";
import { Provider as ChakraProvider } from "../components/ui/provider";

type ExtendedOptions = Omit<RenderOptions, "wrapper"> & {
preloadedState?: Partial<RootState>;
store?: ReturnType<typeof makeTestStore>;
};

export function makeTestStore(preloadedState?: Partial<RootState>) {
return configureStore({
    reducer: rootReducer,
    preloadedState,
});
}

export function renderWithProviders(
ui: ReactElement,
{ preloadedState, store = makeTestStore(preloadedState), ...options }: ExtendedOptions = {},
) {
function Wrapper({ children }: PropsWithChildren) {
    return (
    <ReduxProvider store={store}>
        <ChakraProvider>
        <ThemeProvider theme={themes[0]}>
            {children}
        </ThemeProvider>
        </ChakraProvider>
    </ReduxProvider>
    );
}

return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
