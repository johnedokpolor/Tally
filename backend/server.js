const content = "Hello to @itachi @sasuke and my friend @garra";
const mentions =
  content
    .match(/@\w+/g)
    ?.map((mention) => mention.toLowerCase().replace("@", "")) || [];

console.log(mentions);
