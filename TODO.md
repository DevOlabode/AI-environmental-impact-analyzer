# TODO: Update Impact Schema References

## Tasks
- [x] Update models/impact.js: Remove unused Product require
- [x] Update controllers/form.js:
  - [x] Fix input method: Change 'impact' to 'impactAnalysis'
  - [x] Update editInput method: Create Impact document and set impactAnalysis to _id
  - [x] Add populate('impactAnalysis') to allProducts and showProducts
- [x] Update controllers/reciept.js:
  - [x] Import Impact model
  - [x] Update analyseReciept: Create Impact documents and set impactAnalysis to _ids

## Followup
- [ ] Test creating, editing, and viewing products
- [ ] Verify receipt analysis creates Impact documents properly
