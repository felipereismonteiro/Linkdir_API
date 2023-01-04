import { connectionDB } from "../db/db.js";

function filterHashtags(str) {
  const hashtags = str
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => {
      if (word[0] === "#") {
        return true;
      }
    });

  return hashtags;
}

export function postHashtag(str) {
  function buildQueryString() {
    const valuesPosition = filterHashtags(str)
      .map((word, index) => `($${index + 1})`)
      .join(", ");
    const queryString = `INSERT INTO hashtags (name) VALUES ${valuesPosition} ON CONFLICT (name) DO NOTHING RETURNING id`;

    return queryString;
  }

  function buildQueryArray() {
    const queryArray = filterHashtags(str).map((word) => word.replace("#", ""));

    return queryArray;
  }

  return connectionDB.query(buildQueryString(), buildQueryArray());
}

const hashtagsRepository = { postHashtag };

export default hashtagsRepository;

//
