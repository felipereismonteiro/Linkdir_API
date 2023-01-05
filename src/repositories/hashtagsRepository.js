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

  return connectionDB.query(buildQueryString(), filterHashtags(str));
}

export function postHashTagsAndPostIds(array, postId) {
  function buildQueryArray() {
    const queryArray = [];

    array.forEach((object) => queryArray.push(postId, object.id));

    return queryArray;
  }

  function buildQueryString() {
    const formattedIndexPositions = [];

    for (let i = 0; i <= buildQueryArray().length - 2; i += 2) {
      formattedIndexPositions.push(`($${i + 1}, $${i + 2})`);
    }

    const queryString = `INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ${formattedIndexPositions.join(
      ", "
    )}`;

    return queryString;
  }

  return connectionDB.query(buildQueryString(), buildQueryArray());
}

export function getHashtagsByNames(str) {
  function buildQueryString() {
    const formattedIndexPositions = filterHashtags(str)
      .map((word, index) => `($${index + 1})`)
      .join(", ");

    return `SELECT id FROM hashtags WHERE name IN (${formattedIndexPositions})`;
  }
  console.log(buildQueryString());
  return connectionDB.query(buildQueryString(), filterHashtags(str));
}

export function getHashtags() {
  return connectionDB.query(`SELECT * FROM hashtags`);
}

const hashtagsRepository = {
  postHashtag,
  postHashTagsAndPostIds,
  getHashtagsByNames,
  getHashtags,
  filterHashtags
};

export default hashtagsRepository;
