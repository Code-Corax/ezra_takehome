  /* eslint-disable @typescript-eslint/no-empty-object-type */

import "styled-components";
import type { AppTheme } from "./app/utils/themes";

declare module "styled-components" {
    export interface DefaultTheme extends AppTheme {}
}

export {};