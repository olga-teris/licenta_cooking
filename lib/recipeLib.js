import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'recipes');

  export function getAllRecipeIds() {
    const fileNames = fs.readdirSync(postsDirectory);
  
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

  
export function getAllRecipeInfo() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allRecipeInfo = fileNames.map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');
  
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
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

export function getRecipeInfo(id){
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const matterResult = matter(fileContents);

    // console.log(matterResult)
    return matterResult
}

export function getRecipesInfoByName(names) {
  
  const allRecipeInfo = getAllRecipeInfo()
  // console.log("aici")
  // console.log(allRecipeInfo)
  let recipesInfo = []

  for (const recipe of allRecipeInfo ) {
    // console.log(recipe)
    if (names.includes(recipe.title)){
      // console.log("match")
      recipesInfo.push(recipe)
    }
  }
  // console.log("acolo")
  // console.log(recipesInfo)
   
  
  return (
      recipesInfo
  )
}

export function getRecipesByCategory(cat) {
  const allRecipeInfo = getAllRecipeInfo()

  let recipesInfo = []

  for (const recipe of allRecipeInfo ) {

    if (recipe.categories.includes(cat.toLowerCase())){
      recipesInfo.push(recipe)
    }
  }
  // console.log("acolo")
  // console.log(recipesInfo)
   
  
  return (
      recipesInfo
  )
}

export function getRecipesByIngredient(ing) {
  const allRecipeInfo = getAllRecipeInfo()
  let recipesInfo = []

  for (const recipe of allRecipeInfo ) {
    if (recipe.ingredients.includes(ing.toLowerCase())){
      recipesInfo.push(recipe)
    }
  }

  return (
      recipesInfo
  )
}