// Imports
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import { Comment } from "../models/comment.js";

// Routes
async function createPost(req, res) {
  if (req.file !== undefined) {
    req.body.image = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    console.log(req.body.image, "image");
  } else {
    req.body.image = null;
  }

  // Enregistre les informations de la creation d'un post
  try {
    if (req.body.content !== "") {
      const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        user_id: req.user.userId,
      });
      console.log(post, "info poster");
      return res.status(201).json({ post, message: "Post créé !" });
    } else {
      res.status(401).json({ error: "il ya rien a poster" });
    }
    //Paramètre
  } catch (error) {
    res.status(500).json({ error: "erreur de creation de post" });
    console.log(error);
  }
}

// Routes
async function getAllPosts(req, res) {
  // Recupération de tout les posts enregistrer dans la base de données
  try {
    //Paramètre
    const allPostWall = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["firstName", "isAdmin"],
        },
        {
          model: Comment,
          separate: true,
          order: [["id", "ASC"]],
          include: [User],
        },
      ],
      order: [["id", "DESC"]],
    });
    return res.status(200).json(allPostWall);
  } catch (error) {
    res.status(400).json({ error, error: "erreur de récupération des posts" });
    console.log(error);
  }
}
// Routes
async function deletePost(req, res) {
  // Supprime le post enregistrer dans la base de données
  let idUserStore = req.user.userId;
  const userIdPost = req.params.id;
  try {
    //Paramètre
    const postFind = await Post.findOne({
      where: { id: req.params.id },
      include: [{ model: User, attributes: ["isAdmin"] }],
    });
    const userFindPost = postFind.user_id;
    //Cherche si admin ou pas
    const isAdmin = req.user.isAdmin;
    if (isAdmin == true || idUserStore == userFindPost) {
      await Post.destroy({
        where: { id: userIdPost },
      });
      res.status(200).json({ message: "Post supprimé !" });
    } else {
      res
        .status(400)
        .send({ message: "Vous n'êtes pas autorisé a supprimez ce post!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, error: "erreur suppression post" });
  }
}
// Routes
async function modifyPost(req, res) {
  const modifyPost = {
    title: req.body.title,
    content: req.body.content,
  };
  try {
    if (req.user.userId) {
      await Post.update(modifyPost, { where: { id: req.params.id } });
      res.status(200).json({ message: "Post modifié !" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}

async function getPicture(req, res) {
  // Récupère les informations de l'utilisateur  aprés identification
  try {
    let userId = req.user.userId;
    // Paramètre
    const user = await Post.findOne({
      attributes: ["image"],
      where: { id: userId },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error, erreur: "echec récupération" });
  }
}
// Exportation
export { createPost, getAllPosts, deletePost, modifyPost, getPicture };
