const GET_ACCESS_TOKEN = function async(req, res) {
  const userId = req.user.id;
  const access_token = jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TIME,
  });
  const refresh_token = GENERATE_REFRESH_TOKEN(userId);
  return res.json({ status: true, message: "success", data: { access_token, refresh_token } });
};

const GENERATE_REFRESH_TOKEN = function async(userId) {
  const refresh_token = jwt.sign({ sub: user_id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TIME,
  });

  redis_client.get(user_id.toString(), (err, data) => {
    if (err) throw err;

    redis_client.set(user_id.toString(), JSON.stringify({ token: refresh_token }));
  });

  return refresh_token;
};
