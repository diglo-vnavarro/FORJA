import { lazyComponent } from "./lazyComponent";

function ExamplePage() { return <div>Example</div>; }

it("maps a named page export to the React Router lazy contract", async () => {
  const load = lazyComponent(async () => ({ ExamplePage }), "ExamplePage");
  await expect(load()).resolves.toEqual({ Component: ExamplePage });
});
