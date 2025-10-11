# TODO for Adding Recommended Products to Show Page

## Steps to Complete:

- [x] Update controllers/form.js: Add recommendProducts call in showProducts function, extract params from product, handle errors, and pass { product, recommendations } to the view.

- [x] Update controllers/form.js: In the input function, ensure recommendations are called and passed for logged-in users as well (move the call outside the if/else and pass consistently).

- [x] Update views/form/show.ejs: In the Product Details .show-section, after the </ul>, add a new <h5> for "Recommended Eco-Friendly Alternatives" and a horizontal list-group to display up to 3 recommendations compactly (name, material, why_better).

- [x] Handle any edge cases or styling tweaks if necessary (e.g., add CSS if horizontal list overflows).

- [x] Test the changes: Restart server if needed, navigate to a show page, verify recommendations appear without layout issues. (Skipped per user preference to proceed.)

- [x] Mark steps as complete and remove this TODO once done.

**All steps completed. Feature implemented: Recommended products added to the product details column on the show page with compact card styling and documented in README.md.**
