import { connectionDB } from "../db/db.js";

function filterHashtags(str) {
  const array = str.match(/#[\wÀ-ÿ\d]+/g);

  if (!array) {
    return [];
  }

  const hashtags = array.map((h) => h.replace("#", ""));

  return hashtags;
}

export function postHashtag(array) {
  function buildQueryString() {
    const valuesPosition = array
      .map((word, index) => `($${index + 1})`)
      .join(", ");
    const queryString = `INSERT INTO hashtags (name) VALUES ${valuesPosition} ON CONFLICT (name) DO NOTHING RETURNING id`;

    return queryString;
  }

  return connectionDB.query(buildQueryString(), array);
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

export function getHashtagsByNames(array) {
  function buildQueryString() {
    const formattedIndexPositions = array
      .map((word, index) => `($${index + 1})`)
      .join(", ");

    return `SELECT id FROM hashtags WHERE name IN (${formattedIndexPositions})`;
  }
  return connectionDB.query(buildQueryString(), array);
}

export function getHashtags() {
  return connectionDB.query(
    `SELECT 
     hashtags.*, COUNT(posts_hashtags.hashtag_id) AS total_amount
   FROM 
    hashtags
  JOIN 
    posts_hashtags
  ON
    posts_hashtags.hashtag_id = hashtags.id
  GROUP BY 
     hashtags.id
  ORDER BY
    total_amount DESC
  LIMIT 10
   `
  );
}

export function getOneHashTagByName(name) {
  return connectionDB.query(`SELECT id FROM hashtags WHERE name=$1`, [name]);
}

const hashtagsRepository = {
  postHashtag,
  postHashTagsAndPostIds,
  getHashtagsByNames,
  getHashtags,
  filterHashtags,
  getOneHashTagByName,
};

export default hashtagsRepository;
