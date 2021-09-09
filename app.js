const csv = require('csv-parser');
const fs = require('fs');
const nestedProperty = require('nested-property');
let results = [];


const myPromise = new Promise((resolve, reject) => {
    fs.createReadStream('table1.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        resolve(results);
    });
});

const createKey = (text) => {
    return text
      .trim()
      .replaceAll(/[,.'`]/g, '')
      .replaceAll(/\s|-/g, '_')
      .replaceAll('/', '_or_')
      .toLocaleUpperCase();
  }

const createItem = (display, key) => ({
    key,
    display,
    subCategory: {},
});

myPromise
    .then(value => {
        return value;
    })
    .then(array => {
        const result = {};
        const keys = {
            category: 'Category',
            subCategory: 'Sub-Category',
            subSubCategory: 'Sub-Category 2',
        };

        array.forEach((row) => {
            const category = row[keys.category];
            const categoryKey = createKey(category);
            if (!result[categoryKey] && !!categoryKey) {
                result[categoryKey] = createItem(category, categoryKey);
            }

            const subCategory = row[keys.subCategory];
            const subCategoryKey = createKey(subCategory);
            if (!result[categoryKey].subCategory[subCategoryKey] && !!subCategoryKey) {
                result[categoryKey].subCategory[subCategoryKey] = createItem(subCategory, subCategoryKey);
            }

            const subSubCategory = row[keys.subSubCategory];
            const subSubCategoryKey = createKey(subSubCategory);
            if (!result[categoryKey].subCategory[subCategoryKey].subCategory[subSubCategoryKey] && !!subSubCategoryKey) {
                result[categoryKey].subCategory[subCategoryKey].subCategory[subSubCategoryKey] = createItem(subSubCategory, subSubCategoryKey);
            }
        });
        console.log(JSON.stringify(result, null, 2));
    })

