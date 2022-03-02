const yup = require("yup")

const genreSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
});

export default genreSchema;