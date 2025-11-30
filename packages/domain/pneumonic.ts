import z from "zod";
import Result, { type ResultType } from "@secret-santa/prelude/result";

const winterWords: string[] = [
  "winter",
  "snow",
  "snowfall",
  "snowflake",
  "snowstorm",
  "snowman",
  "snowbound",
  "blizzard",
  "frost",
  "frostbite",
  "frosty",
  "icy",
  "ice",
  "icicle",
  "sleet",
  "hail",
  "chill",
  "cold",
  "freezing",
  "glacial",
  "arctic",
  "polar",
  "solstice",
  "evergreen",
  "pine",
  "fir",
  "spruce",
  "holly",
  "mistletoe",
  "wreath",
  "garland",
  "ornament",
  "tinsel",
  "stocking",
  "chimney",
  "hearth",
  "fireplace",
  "sleigh",
  "sled",
  "sledding",
  "reindeer",
  "elf",
  "elves",
  "Santa",
  "Kringle",
  "Northpole",
  "workshop",
  "present",
  "gift",
  "wrapping",
  "festive",
  "holiday",
  "carol",
  "caroling",
  "bells",
  "jingle",
  "yuletide",
  "noel",
  "nativity",
  "manger",
  "candle",
  "lantern",
  "skating",
  "snowball",
  "wintertime",
  "cozy",
  "cocoa",
  "gingerbread",
  "peppermint",
  "candycane",
  "chestnuts",
  "nutcracker",
  "pinecone",
  "skiing",
  "snowboard",
  "parka",
  "scarf",
  "mittens",
  "gloves",
  "boots",
  "firewood",
  "eggnog",
  "cranberry",
  "lights",
  "twinkle",
  "frosted",
  "wonderland",
  "midwinter",
  "sugarplum",
  "yulelog",
  "treetop",
  "seasonal",
  "cookies",
  "cracker",
  "stockings",
  "holidays",
  "chimneys",
  "sleds",
] as const;

export const pneumonicSchema = z.object({
  value: z
    .string()
    .regex(/^(\w-?)+\w$/)
    .readonly(),
});

export type Pneumonic = z.infer<typeof pneumonicSchema>;

const create = (n: number) => ({
  value:
    Array.from({ length: n }, () =>
      Math.floor(Math.random() * winterWords.length),
    )
      .map((i) => winterWords[i])
      .reduce((acc, curr) => `${acc}-${curr}`)
      ?.toLowerCase() ?? "",
});

const from = (value: string): ResultType<Pneumonic> => {
  const result = pneumonicSchema.safeParse({ value });
  return result.success
    ? Result.success(result.data)
    : Result.error(`Could not create ${value} into a pneumonic`);
};

export default {
  create,
  from,
};
