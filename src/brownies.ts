export type Brownie = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export const BROWNIES: Brownie[] = [
  {
    id: "classic",
    name: "Classic Fudge",
    description: "Rich, dense, and unapologetically chocolatey.",
    image: "/brownies/classic.jpg",
  },
  {
    id: "walnut",
    name: "Walnut Crunch",
    description: "Fudgy base with toasted walnuts on top.",
    image: "/brownies/walnut.jpg",
  },
  {
    id: "salted-caramel",
    name: "Salted Caramel Swirl",
    description: "Caramel ribbons and flaky sea salt.",
    image: "/brownies/salted-caramel.jpg",
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter Cup",
    description: "Peanut butter layer baked into the middle.",
    image: "/brownies/peanut-butter.jpg",
  },
  {
    id: "espresso",
    name: "Espresso Kick",
    description: "Dark chocolate with a shot of espresso.",
    image: "/brownies/espresso.jpg",
  },
];
