const po = process.env.PORT || 3001;

const appp = require("./appp");

appp.listen(po, () => {
  console.log(`Started express server at po ${po}`);
});
