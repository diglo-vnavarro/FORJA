import { render } from "@testing-library/react";
import iconMap from "./icon-map.json";
import { FORJA_ICON_MAP, ForjaIcon, type ForjaIconName } from "./ForjaIcon";

it("gives every semantic concept its own glyph", () => {
  const components = Object.values(FORJA_ICON_MAP);
  expect(new Set(components).size).toBe(components.length);
});

it("keeps icon-map.json aligned with the component map", () => {
  expect(iconMap.map((entry) => entry.name).sort()).toEqual(Object.keys(FORJA_ICON_MAP).sort());
  for (const entry of iconMap) {
    const component = FORJA_ICON_MAP[entry.name as ForjaIconName] as { displayName?: string; name?: string };
    const expected = entry.source === "Tabler Icons" ? entry.component.replace(/^Icon/, "") : entry.component;
    expect(component.displayName ?? component.name).toBe(expected);
  }
});

it("renders the custom dumbbell with the default FORJA stroke", () => {
  const { container } = render(<ForjaIcon name="dumbbell" />);
  expect(container.querySelector("svg")).toHaveAttribute("stroke-width", "1.8");
});
