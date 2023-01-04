import { connectionDB } from "../db/db.js";

function filterHashtags(str) {
  const hashtags = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "#") {
      continue;
    }
    let hashtag = "";

    for (let j = i + 1; j < str.length; j++) {
      if (str[j].match(/[^a-zA-Z0-9ç]/g)) {
        break;
      }
      hashtag += str[j];
    }
    if (hashtag !== "") {
      hashtags.push(hashtag);
    }
  }
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
