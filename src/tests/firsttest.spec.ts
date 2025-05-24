import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  // Expect a title "to contain" a substring.
  const appTitle = page.getByTestId("appTitle");
  await expect(appTitle).toContainText("Pokemons of the");
});



//show only 151 pokemon
//should have a pagination
//there hare 10 pokemeon displayed at first
//each pokemon should have: types, ID, height, weight, a picture,  abilities
//should be sortable by: name, type, ID
//can search in the list
//display the current cumulated weight
//should redirect to a description page of the clicked row with : types, ID, height, weight, a picture,  abilities

/*test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
*/
