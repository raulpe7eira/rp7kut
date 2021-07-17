import jwt from "jsonwebtoken";

export default async function generateToken(req, res) {
  jwt.sign(
    req.body,
    'sign-secrect',
    {
      expiresIn: 31556926, // 1 year in seconds
    },
    (err, token) => {
      res.status(200).json({
        token: token,
      });
    },
  );
}
