const Comment = require("../models/comment"); // comments models required
const Post = require("../models/post"); // post model required
const nodeMailer = require("../mailers/comments_mailer");
module.exports.create = async (req, res) => {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                // creating comment if post found
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            post.comments.push(comment); // mongoose function to update comment
            post.save(); // telling db its final, save it

            //will take care of nodemailer later
            // comment = await comment.populate("user", "name email").execPopulate();
            // nodeMailer.newComment(comment);
            req.flash("success", "Comment Successfully Created");

            res.redirect("/");
        }
    } catch (err) {
        console.log(`Error ${err}`);
    }
};

module.exports.destroy = async(req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            // if comment found
            let postId = comment.post; // saving of id of post whose comment is going to delete
            comment.remove(); // removing comment

            let post = await Post.findByIdAndUpdate(postId, {
                $pull: { comment: req.params.id },
            });
            req.flash("success", "Comment deleted");
            return res.redirect("back");
        } else {
            return res.redirect("back");
        }
    } catch (err) {
        console.log(`Error ${err}`);
    }
};