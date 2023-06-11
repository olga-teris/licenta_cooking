const { PrismaClient } = require('prisma/prisma-client')
const fs = require( 'fs' )
const path = require( 'path')
const matter = require('gray-matter')

const prisma = new PrismaClient()

async function main() {

    await prisma.ingredient.createMany({
        data: [
            { name: 'Tomato'},
            { name: 'Potato'},
            { name: 'Cabbage'},
            { name: 'Milk'},
            { name: 'Salt'},
            { name: 'Bell Pepper'},
            { name: 'Corn'},
            { name: 'Flour'},
            { name: 'Oregano'},
            { name: 'Lemon'},
            { name: 'Vinegar'},
            { name: 'Beef'},
            { name: 'Pork'},
            { name: 'Chicken'},
            { name: 'Egg'},
            { name: 'Butter'},
            { name: 'Cooking Oil'},
            { name: 'Water'},
            { name: 'Garlic'},
            { name: 'Onion'},
            { name: 'Backing Powder'},
            { name: 'Backing Soda'},
            { name: 'Yeast'},
            { name: 'Carrot'},
            { name: 'Lettuce'},
            { name: 'Pasta'},
            { name: 'Fish'},
            { name: 'Salmon'},
            { name: 'Avocado'},
            { name: 'Thyme'},
            { name: 'Yogurt'},
            { name: 'Cream'},
            { name: 'Cream Cheese'},
            { name: 'Vanilla'},
            { name: 'Celery'},
            { name: 'Parsley'},
            { name: 'Pumpkin'},
            { name: 'Wine'},
            { name: 'Chocolate'},
            { name: 'Chicken Stock'},
        ],
        skipDuplicates: true
    })

    await prisma.category.createMany({
      data: [
          { name: 'Lunch'},
          { name: 'Dinner'},
          { name: 'Breakfast'},
          { name: 'Dessert'},
          { name: 'Bread'},
          { name: 'Cake'},
          { name: 'Stew'},
          { name: 'Meat'},
          { name: 'Bake'},
          { name: 'No-Bake'},
          { name: 'Soup'},
          { name: 'Pasta'},
          { name: 'Salad'},

      ],
      skipDuplicates: true
  })

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
      // console.log(r)
      if ( r.length != 0 ) return r[0].id
      return 0
  }

  async function getCatId ( name ) {
      const r = await prisma.$queryRaw`SELECT id FROM category WHERE UPPER(name) = UPPER(${name})`
      
      if ( r.length != 0 ) return r[0].id
      return 0
  }

  const res = getAllRecipeInfo()
  const requiredRecipeData = res.map((e) => {return{name: e.title, ingredients: e.ingredients, categories: e.categories}})
  // console.log(requiredRecipeData)


  for (const recipe of requiredRecipeData) {
      const createRecipe = await prisma.recipe.create({
          data: { name: recipe.name }
      });

      const createdRecipeId = createRecipe.id

      for (const ing of recipe.ingredients) {
          const ingId = await getIngId(ing)
          if (ingId != 0) {
              const aux = await prisma.recipeIng.create({
                  data: { recipeId: createdRecipeId, ingredientId: ingId }
              });
          }
      }

      for (const cat of recipe.categories) {
          const catId = await getCatId(cat)
          if (catId != 0) {
              const aux = await prisma.recipeCat.create({
                  data: { recipeId: createdRecipeId, categoryId: catId }
              });
          }
      }
}
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })