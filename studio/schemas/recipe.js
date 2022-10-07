export default {
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Recipe Name",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "chef",
      title: "Chef",
      type: "reference",
      to: { type: "chef" },
    },
    {
      name: "mainImage",
      title: "Recipe Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "ingredient",
              title: "Ingredient",
              type: "reference",
              to: [{ type: "ingredient" }],
            },
            {
              name: "wholeNumber",
              title: "Whole Number",
              type: "number",
            },
            {
              name: "fraction",
              title: "Fraction",
              type: "string",
              options: {
                list: [
                  "1/2",
                  "1/3",
                  "1/4",
                  "1/8",
                  "3/4",
                  "2/3",
                  "3/8",
                  "3/4",
                  "1/16",
                ],
              },
            },
            {
              name: "unit",
              title: "Unit",
              type: "string",
              options: {
                list: ["grams", "cup", "Tbsp.", "tsp."],
              },
            },
          ],
          preview: {
            select: {
              title: "ingredient.name",
              name: "ingredient.name",
              media: "ingredient.image",
              wholeNumber: "wholeNumber",
              fraction: "fraction",
              unit: "unit",
            },
            prepare({
              title,
              media,
              wholeNumber = "(No whole numebr ser)",
              subtitle,
              fraction = "(No fraction set)",
              unit = "(No unit set)",
            }) {
              return {
                title,
                media,
                subtitle: `${wholeNumber} ${fraction} ${unit}`,
                media,
              };
            },
          },
        },
      ],
    },
    {
      name: "instructions",
      title: "Instructions",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "likes",
      title: "Likes",
      type: "number",
    },
  ],
  initialValue: {
    likes: 0,
  },
};
