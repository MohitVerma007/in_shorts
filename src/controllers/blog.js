const db = require("../db");

exports.createBlog = async (req, res, formattedFileUrls) => {
  const { title, description } = req.body;

  try {
    const cover_img =
      formattedFileUrls && formattedFileUrls.cover_img
        ? formattedFileUrls.cover_img[0].downloadURL
        : null;

    // Check if the title already exists in the blog table
    const titleExists = await db.query("SELECT * FROM blog WHERE title = $1", [
      title,
    ]);
    if (titleExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Blog with the provided title already exists." });
    }

    await db.query(
      `INSERT INTO blog (title, description, cover_img) 
         VALUES ($1, $2, $3)`,
      [title, description, cover_img]
    );

    return res
      .status(201)
      .json({ success: true, message: "Blog created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM blog");
    return res.status(200).json({ success: true, blogs: rows });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.query("SELECT * FROM blog WHERE id = $1", [id]);
    if (blog.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res, formattedFileUrls) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    // Ensure featuredImg is only assigned if formattedFileUrls is defined and has featured_img
    const cover_img =
      formattedFileUrls && formattedFileUrls.cover_img
        ? formattedFileUrls.cover_img[0].downloadURL
        : null;

    const existingBlog = await db.query("SELECT * FROM blog WHERE id = $1", [
      id,
    ]);
    if (existingBlog.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const updateFields = {
      title: title || existingBlog.rows[0].title,
      description: description || existingBlog.rows[0].description,
      cover_img: cover_img || existingBlog.rows[0].cover_img,
    };

    await db.query(
      `UPDATE blog 
       SET title = $1, description = $2, cover_img = $3
       WHERE id = $4`,
      [updateFields.title, updateFields.description, updateFields.cover_img, id]
    );

    return res
      .status(200)
      .json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const query = "DELETE FROM blog WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [blogId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const deletedBlog = rows[0];

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};
