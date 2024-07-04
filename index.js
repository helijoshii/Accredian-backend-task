const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();
app.use(bodyParser.json());

// RESTful Endpoints
app.post('/referrals', async (req, res) => {
  const { name, email, referredBy } = req.body;
  if (!name || !email || !referredBy) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const newReferral = await prisma.referral.create({
      data: { name, email, referredBy },
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Referral Received',
      text: `You have been referred by ${referredBy}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json(newReferral);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create referral' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
