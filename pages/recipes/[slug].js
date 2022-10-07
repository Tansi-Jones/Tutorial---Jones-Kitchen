import { sanityClient, urlFor, usePreviewSubscription } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage{
        asset->{ _id, url }
    },
    ingredients[]{
        unit,
        wholeNumber,
        fraction,
        ingredient->{name},
        _key
    },
    instructions,
    likes
}`;

export default function OneRecipe({ recipe, preview }) {
  const [likes, setLikes] = useState(recipe?.likes);

  const router = useRouter();

  const { recipe: data } = usePreviewSubscription(recipeQuery, {
    params: { slug: recipe?.slug.current },
    initialData: recipe,
    enabled: preview,
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POSt",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error));

    const data = await res.json();

    setLikes(data.likes);
  };

  return (
    <article className="recipe">
      <h1>{recipe.name}</h1>
      <button className="like-button" onClick={addLike}>
        {likes} 💝
      </button>
      <main className="content">
        <Image
          src={urlFor(recipe?.mainImage).url()}
          alt={recipe.name}
          layout="responsive"
          width={100}
          height={100}
        />

        <div className="breakdown">
          <ul className="ingredients">
            {recipe.ingredients?.map((ingredient) => (
              <li key={ingredient._key} classNameingredient>
                {ingredient.wholeNumber}
                {ingredient.fraction}
                {ingredient.unit}
                <br />
                {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <PortableText value={recipe.instructions} className="instructions" />
        </div>
      </main>
    </article>
  );
}

export async function getStaticPaths() {
  const paths =
    await sanityClient.fetch(`*[_type == "recipe" && defined(slug.current)]{
        "params": {"slug": slug.current}
    }`);

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });

  return {
    props: { recipe, preview: true },
  };
}
