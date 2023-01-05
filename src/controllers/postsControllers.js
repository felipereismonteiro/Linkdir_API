import hashtagsRepository, {
  postHashTagsAndPostIds,
} from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function createPost(req, res) {
  const { user_id, content, url } = req.body;

  const existingHashtags = res.locals.existingHashtags;
  const hashtags = res.locals.hashtags;

  try {
    const { rows: postRows } = await postsRepository.createPost(
      user_id,
      content,
      url
    );
    const postId = postRows[0].id;

    if(hashtags) {
        const { rows: hashtagsRows } = await hashtagsRepository.postHashtag(
            content
          );
    
          let hashtagsIds = hashtagsRows;
      
          if (existingHashtags !== undefined) {
            hashtagsIds = [...hashtagsRows, ...existingHashtags];
          }
      
          await hashtagsRepository.postHashTagsAndPostIds(hashtagsIds, postId);     
    }
  
      res.sendStatus(201);
    } catch (err) {
        console.log(err.message)
      res.status(500).send(err.message);
    }
  }


export async function getPosts(req, res) {

  // urlMetadata("https://www.youtube.com/watch?v=LwJvZOSQWrE&ab_channel=ESPNBrasil").then(metadata => {
  //   console.log(metadata.title);
  //   console.log(metadata.description);
  //   console.log(metadata.image);
  // });

    try {
        const { rows } = await postsRepository.getPosts();
        const postsPromises = rows.map(async (p) => {
          let post = {};
          await urlMetadata(p.url).then(metadata => {
              if(!metadata.title) {
                post = {...p, title: "Link", description: metadata.description, image: metadata.image}
              } else {
                post = {...p, title: metadata.title, description: metadata.description, image: metadata.image}
              }
   
          });
          
          return post;
        })
        const posts = await Promise.all(postsPromises) 

        res.status(200).send(posts); 
    } catch(err) {
        res.status(500).send(err.message) 
    }
}

