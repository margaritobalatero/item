mongoose.connect("mongodb+srv://junjie:junjie55@junjiecluster.1cawbvg.mongodb.net/mern_item?retryWrites=true&w=majority&appName=junjiecruditemremix")
  .then(() => console.log("Connected!"))
  .catch(err => console.error(err));