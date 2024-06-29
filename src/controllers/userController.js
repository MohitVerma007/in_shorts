const emailHelper = require("../../helpers/emails");
const axios = require("axios");
const path = require('path');

const db = require("../db");



const sendMail = async(req,res)=>{
    const {name, email, content} = req.body

    try {

        const result = await db.query(
            'INSERT INTO messages (name, email, content) VALUES ($1, $2, $3) RETURNING *',
            [name, email, content]
          );
        const id = result.rows[0].id
        console.log(id)
        const url = `https://in-shorts-pi.vercel.app/api/v1/mail/image?id=${id}`;
        console.log(url)
        
        emailHelper.sendSignUpMail(name, email, content, url);
        
        res.status(200).json({success:true, msg: 'Mail Sent Successfully!'});

    } catch (error) {
        res.status(400).json({success:false, msg: error.message});
    }

}



const imageApi = async (req, res) => {
    const message_id = req.query.id;
  
    console.log(`Received message id: ${message_id}`);
  
    // External image URL

    // const imageUrl = path.join(__dirname, '../../public', 'astro.svg');

    const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/todoapp-5cd34.appspot.com/o/astrologo.svg?alt=media&token=6aa2b6db-e572-4fb2-9bb1-83de39d67ff4';
  
    try {
      // Fetch the image from the external URL
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      await db.query(
        'UPDATE messages SET status = $1, seen_date = NOW() WHERE id = $2',
        ['seen', message_id]
      );
  
      // Set the appropriate headers
      res.set('Content-Type', response.headers['content-type']);
  
      // Send the image as a response
      res.send(response.data);
    } catch (error) {
      console.error('Error fetching the image:', error);
      res.status(500).send('Error fetching the image');
    }
  };

// const imageApi = async (req, res) => {
//     const message_id = req.query.id;
  
//     console.log(`Received message id: ${message_id}`);
  
//     // Path to the image in the public folder
//     const imagePath = path.join(__dirname, '../../public', 'astro.svg');
  
//     try {
//       // Update the status and seen_date in the database
//       await db.query(
//         'UPDATE messages SET status = $1, seen_date = NOW() WHERE id = $2',
//         ['seen', message_id]
//       );
  
//       // Send the image file as a response
//       res.sendFile(imagePath);
//     } catch (error) {
//       console.error('Error handling the image request:', error);
//       res.status(500).send('Error handling the image request');
//     }
//   };

const getMessages = async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM messages');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).send('Error fetching messages');
    }
  };

const createMessage = async (req, res) => {
    const { name, email, content } = req.body;
  
    try {
      const result = await db.query(
        'INSERT INTO messages (name, email, content) VALUES ($1, $2, $3) RETURNING *',
        [name, email, content]
      );
      console.log(result.rows[0].id)
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).send('Error creating message');
    }
  };
  

module.exports = {
    imageApi,
    getMessages,
    createMessage,
    sendMail
}