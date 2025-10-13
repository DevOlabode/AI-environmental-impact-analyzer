# TODO: Fix Recommended Products Issue

## Steps to Complete
- [x] Update `controllers/form.js` to generate recommendations on the fly for all product views (remove storing in DB)
- [x] Update `views/form/show.ejs` to use `recommendations` variable instead of `product.recommendProducts`
- [x] Fix material reference bug in mobile alternatives section (`recommendations.material` to `rec.material`)
- [x] Add alternatives section to desktop layout in `views/form/show.ejs`
- [x] Store recommendations in DB for new products
- [x] Update view to check both recommendations variable and product.recommendedProducts
- [ ] Test the show page for existing products
- [ ] Check console for AI generation errors
- [ ] Verify recommendations display on both mobile and desktop
