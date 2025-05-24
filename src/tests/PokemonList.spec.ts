import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

test("has title", async ({ page }) => {
  const appTitle = page.getByTestId("appTitle");
  await expect(appTitle).toContainText("Pokemons of the");
});

// show only 151 pokemon (assuming generation 1 is selected by default or can be selected)
test("should fetch 151 Pokemon for Generation 1 via network call", async ({
  page,
}) => {
  // We expect a network request to fetch the Pokemon data for Generation 1.
  // The URL provided by the user is https://pokeapi.co/api/v2/generation/generation-i
  const pokemonSpeciesResponsePromise = page.waitForResponse(
    (response) =>
      response.url() === "https://pokeapi.co/api/v2/generation/generation-i" &&
      response.status() === 200
  );

  // Ensure "generation-i" is selected (it appears to be the default based on the HTML provided earlier).
  // If not, you would click the dropdown and select the generation here.
  const generationSelectLabel = page.locator(
    '.p-select-label[aria-label="generation-i"]'
  );
  await expect(generationSelectLabel).toBeVisible();

  // Wait for the network response
  const response = await pokemonSpeciesResponsePromise;
  const responseBody = await response.json();

  // According to PokeAPI's documentation for the generation endpoint,
  // the list of Pokemon species is under the 'pokemon_species' key.
  expect(responseBody.pokemon_species).toBeInstanceOf(Array);
  expect(responseBody.pokemon_species.length).toBe(151);
});

// should have a pagination
test("should have a pagination", async ({ page }) => {
  const paginator = page.locator(".p-paginator");
  await expect(paginator).toBeVisible();
});

// there are 10 pokemon displayed at first
test("should display 10 Pokemon initially", async ({ page }) => {
  const rows = page.locator("table.p-datatable-table tbody tr");
  await expect(rows).toHaveCount(10);
});

// each pokemon should have: types, ID, height, weight, a picture, abilities
test("each Pokemon should have required details", async ({ page }) => {
  // Retrieve the first line of the table for verification
  const firstRow = page.locator("table.p-datatable-table tbody tr").first();

  // Check Pokemon ID
  const idElement = firstRow.locator("td:nth-child(1) p");
  await expect(idElement).toBeVisible();
  await expect(idElement).not.toBeEmpty();
  await expect(idElement).toContainText(/^\d+$/);

  // Check Pokemon image
  const imageElement = firstRow.locator("td:nth-child(3) img");
  await expect(imageElement).toBeVisible();
  await expect(imageElement).toHaveAttribute("src", /.+/);
  await expect(imageElement).toHaveAttribute("alt", /.+/);

  // Check Pokemon types
  // The locator finds several .p-tag elements, which is normal for types.
  // We check that the group of tags is visible and that there is at least one.
  const typesTags = firstRow.locator("td:nth-child(4) .p-tag");
  await expect(typesTags.first()).toBeVisible(); // Checks that the first type tag is visible
  await expect(typesTags).not.toHaveCount(0); // Ensures that there is at least one type

  // Check the Pokemon's abilities
  // Likewise, abilities can have several tags.
  const abilitiesTags = firstRow.locator("td:nth-child(5) .p-tag");
  await expect(abilitiesTags.first()).toBeVisible(); // Checks that the first capacity tag is visible
  await expect(abilitiesTags).not.toHaveCount(0); // Ensures that there is at least one capacity

  // Check the Pokemon's height
  const heightElement = firstRow.locator("td:nth-child(6) span");
  await expect(heightElement).toBeVisible();
  await expect(heightElement).not.toBeEmpty();
  await expect(heightElement).toContainText(/^\d+(\.\d+)?$/);

  // Check the Pokemon's weight
  const weightElement = firstRow.locator("td:nth-child(7) span");
  await expect(weightElement).toBeVisible();
  await expect(weightElement).not.toBeEmpty();
  await expect(weightElement).toContainText(/^\d+$/);
});
// can search in the list
test("should allow searching in the list by name", async ({ page }) => {
  const searchInput = page.getByPlaceholder("Search by name");
  await searchInput.fill("bulbasaur");

  // Wait for the filter to apply
  await page.waitForTimeout(500);

  const rows = page.locator("table.p-datatable-table tbody tr");
  await expect(rows).toHaveCount(1); // Only Bulbasaur should be displayed

  const pokemonName = await rows
    .first()
    .locator("td:nth-child(2)")
    .textContent();
  expect(pokemonName?.toLowerCase()).toContain("bulbasaur");

  // Clear search and check for all items
  await searchInput.clear();
  await page.waitForTimeout(500);
  await expect(rows).toHaveCount(10); // Should return to 10 displayed Pokemon
});

// display the current cumulated weight
test("should display the current cumulated weight", async ({ page }) => {
  const footer = page.locator(".p-datatable-footer");
  await expect(footer).toBeVisible();
  await expect(footer).toContainText(
    /Total weight of Pokemon displayed: \d+kg/
  );

  // Check if the weight changes when pagination changes (optional, but good for robustness)
  const initialWeightText = await footer.textContent();
  const nextPageButton = page.locator(".p-paginator-next");
  await nextPageButton.click();
  await page.waitForTimeout(500); // Wait for new page to load

  const newWeightText = await footer.textContent();
  expect(newWeightText).not.toEqual(initialWeightText); // Weight should change on new page
});

// should redirect to a description page of the clicked row with : types, ID, height, weight, a picture, abilities
test("should redirect to a description page with full details on row click and verify API call", async ({
  page,
}) => {
  const firstRow = page.locator("table.p-datatable-table tbody tr").first();

  // Retrieve the Pokemon name from the first row to build the expected URLs.
  // The Pokemon name is in the second column.
  const pokemonName = (await firstRow.locator("td:nth-child(2)").textContent())
    ?.trim()
    .toLowerCase();
  expect(pokemonName).toBeTruthy(); // Check that a name has been extracted.

  // Click on the first line of the table to trigger navigation to the description page.
  await firstRow.click();

  // Wait for the page URL to change to the URL of the expected description page.
  // Expected URL is http://localhost:5173/pokemon/{pokemonName}.
  await page.waitForURL(`http://localhost:5173/pokemon/${pokemonName}`);

  // Check Pokemon image
  const pokemonImage = page.locator("div.p-card-header img");
  await expect(pokemonImage).toBeVisible();
  // Check that the src attribute matches the URL format of PokeAPI sprites.
  await expect(pokemonImage).toHaveAttribute(
    "src",
    /https:\/\/raw.githubusercontent.com\/PokeAPI\/sprites\/master\/sprites\/pokemon\/\d+\.png/
  );
  // Check that the alt attribute matches the Pokemon name.
  await expect(pokemonImage).toHaveAttribute("alt", String(pokemonName));

  // Check the card title, which contains the Pokemon's name and ID.
  // Example: “bulbasaur #1”
  const cardTitle = page.locator("div.p-card-title");
  await expect(cardTitle).toBeVisible();
  // Check that the text contains the Pokemon name (case insensitive) and a numerical ID.
  await expect(cardTitle).toContainText(
    new RegExp(`${pokemonName} #\\d+`, "i")
  );

  // Check the Pokemon's height
  // The height is in a paragraph containing the text “Height:”.
  const heightElement = page.locator(
    "div.p-card-subtitle p:has-text('Height:')"
  );
  await expect(heightElement).toBeVisible();
  // Check that the text contains “Height: ‘ followed by a number (integer or decimal) and ’m”.
  await expect(heightElement).toContainText(/Height: \d+(\.\d+)? m/);
  // Check the Pokemon's weight
  // The weight is in a paragraph containing the text “Weight:”.
  const weightElement = page.locator(
    "div.p-card-subtitle p:has-text('Weight:')"
  );
  await expect(weightElement).toBeVisible();
  // Check that the text contains “Weight: ‘ followed by an integer and ’kg”.
  await expect(weightElement).toContainText(/Weight: \d+ kg/);

  // Check Pokemon types
  // The types are in a section with the text “Type(s):” and are represented by badges (.p-badge).
  const typesSection = page.locator(
    "div.p-card-content p:has-text('Type(s):')"
  );
  await expect(typesSection).toBeVisible();
  const typeBadges = typesSection.locator(".p-badge");
  await expect(typeBadges.first()).toBeVisible(); // Check that at least the first type tag is visible.

  await expect(typeBadges).not.toHaveCount(0); // Make sure there is at least one type badge.

  // Check the Pokemon's abilities
  // Abilities are in a section with the text “Abilities:” and are represented by badges (.p-badge).
  const abilitiesSection = page.locator(
    "div.p-card-content p:has-text('Abilities:')"
  );
  await expect(abilitiesSection).toBeVisible();
  const abilityBadges = abilitiesSection.locator(".p-badge");
  await expect(abilityBadges.first()).toBeVisible(); // Check that at least the first capacity badge is visible.
  await expect(abilityBadges).not.toHaveCount(0); // Make sure there is at least one capacity badge.
});
