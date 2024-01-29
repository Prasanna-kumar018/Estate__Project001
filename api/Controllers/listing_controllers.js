const asyncHandler = require("express-async-handler");
const Listing = require("../Schemas/Listing");
const Users = require("../Schemas/Users");
const createhandler = asyncHandler(async (req, res) => {
  const listing = await Listing.create(req.body);
  res.status(201).json(listing);
});

const getAlllisting = asyncHandler(async (req, res) => {
  let id = req.params.id;
  if (id !== req.user.id) {
    res.status(401);
    throw new Error("You can't get other's listings....");
  }
  const listings = await Listing.find({ userRef: id });
  res.status(200).json(listings);
});
const deleteuserlisting = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await Listing.findOne({ _id: id });
  if (!user) {
    res.status(400);
    throw new Error("Listing Not Found....");
  }
  console.log(user.userRef);
  console.log(req.user.id);
  if (user.userRef.toString() !== req.user.id) {
    res.status(401);
    throw new Error("You can't  delete other's listings....");
  }
  let data = await Listing.deleteOne({ _id: id });
  res.status(200).json(data);
});
const updateuserlisting = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await Listing.findOne({ _id: id });
  if (!user) {
    res.status(400);
    throw new Error("Listing Not Found....");
  }
  if (user.userRef.toString() !== req.user.id) {
    res.status(401);
    throw new Error("You can't  Update other's listings....");
  }
  let data = await Listing.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(data);
});
const getuserlisting = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await Listing.findOne({ _id: id });
  if (!user) {
    res.status(400);
    throw new Error("Listing Not Found....");
    }
    console.log(user);
  res.status(200).json(user);
});
const getuser = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await Users.findOne({ _id: id });
  if (!user) {
    res.status(400);
    throw new Error("Owner Not Found....");
  }
  let { Password, ...rest } = user._doc;
  res.status(200).json(rest);
});
const getusers = asyncHandler(async (req, res) => {
  let limit = parseInt(req.query.limit) || 9;
  let startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.query.offer;
  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }
  let parking = req.query.parking;
  if (parking === undefined || parking === "false") {
    parking = { $in: [false, true] };
  }
  let furnished = req.query.furnished;
  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all")
    {
        type= {$in:['rent','sell']}    
    }
    let sort = req.query.sort || "createdAt";
    let order = req.query.order || 'desc';
    let searchTerm = req.query.searchTerm || '';

    const result = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer: offer,
        parking: parking,
        furnished: furnished,
        type: type,
    }).sort(
        { [sort]: order }
    ).limit(limit).skip(startIndex);

    res.json(result)
});
module.exports = {
  createhandler,
  getAlllisting,
  deleteuserlisting,
  updateuserlisting,
  getuserlisting,
  getuser,
  getusers,
};
