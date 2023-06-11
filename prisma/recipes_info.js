const fs = require( 'fs' )
const path = require( 'path')
const matter = require('gray-matter')


const recipesDirectory = path.join(process.cwd(), 'recipes')

function getAllRecipeInfo() {

    const fileNames = fs.readdirSync(recipesDirectory);
    const allRecipeInfo = fileNames.map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');
  
      // Read markdown file as string
      const fullPath = path.join(recipesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
  
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
  
      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });
    return (
        allRecipeInfo
    )
}

async function getIngId ( name ) {
    const r = await prisma.$queryRaw`SELECT id FROM ingredient WHERE UPPER(name) = UPPER(${name})`
    if ( r ) return r
    return 0
}

async function getCatId ( name ) {
    const r = await prisma.$queryRaw`SELECT id FROM category WHERE UPPER(name) = UPPER(${name})`
    if ( r ) return r
    return 0
}

const res = getAllRecipeInfo()
const requiredRecipeData = res.map((e) => {return{name: e.title, ingredients: e.ingredients, categories: e.categories}})
console.log(requiredRecipeData)


for (const recipe of requiredRecipeData) {
    const createRecipe = await prisma.recipe.create({
        data: { name: recipe.name }
    });

    const createdRecipeId = createRecipe.id

    for (const ing of recipe.ingredients) {
        const ingId = getIngId(ing)
        if (ingId != 0) {
            const aux = await prisma.recipeIng.create({
                data: { recipeId: createdRecipeId, ingredientId: ingId }
            });
        }
    }

    for (const ing of recipe.categories) {
        const catId = getCatId(ing)
        if (ingId != 0) {
            const aux = await prisma.recipeCat.create({
                data: { recipeId: createdRecipeId, categoryId: catId }
            });
        }
    }
}


