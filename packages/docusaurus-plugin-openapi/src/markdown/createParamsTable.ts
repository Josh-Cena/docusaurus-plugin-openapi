/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItem, ExampleObject, ParameterObject } from "../types";
import { createDescription } from "./createDescription";
import { createFullWidthTable } from "./createFullWidthTable";
import { getSchemaName } from "./schema";
import { create, guard } from "./utils";

interface Props {
  parameters: ApiItem["parameters"];
  type: "path" | "query" | "header" | "cookie";
}

export function createParamsTable({ parameters, type }: Props) {
  if (parameters === undefined) {
    return undefined;
  }
  const params = parameters.filter(
    (param: any) => param?.in === type
  ) as ParameterObject[];
  if (params.length === 0) {
    return undefined;
  }

  return createFullWidthTable({
    children: [
      create("thead", {
        children: create("tr", {
          children: create("th", {
            style: { textAlign: "left" },
            children: `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } Parameters`,
          }),
        }),
      }),
      create("tbody", {
        children: params.map((param) =>
          create("tr", {
            children: create("td", {
              children: [
                create("code", { children: param.name }),
                create("span", {
                  style: { opacity: "0.6" },
                  children: ` ${getSchemaName(param.schema)}`,
                }),
                guard(param.required, () => [
                  create("span", {
                    style: { opacity: "0.6" },
                    children: " — ",
                  }),
                  create("strong", {
                    style: {
                      fontSize: "var(--ifm-code-font-size)",
                      color: "var(--openapi-required)",
                    },
                    children: " REQUIRED",
                  }),
                ]),
                guard(param.description, (description) =>
                  create("div", {
                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                    children: createDescription(description),
                  })
                ),
                guard(param.example, (example) =>
                  create("div", {
                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                    children: `Example: ${example}`,
                  })
                ),
                guard(param.examples, (examples) =>
                  create("div", {
                    style: { marginTop: "var(--ifm-table-cell-padding)" },
                    children: Object.entries(examples).map(([k, v]) =>
                      create("div", {
                        children: `Example (${k}): ${
                          (v as ExampleObject).value
                        }`,
                      })
                    ),
                  })
                ),
              ],
            }),
          })
        ),
      }),
    ],
  });
}
