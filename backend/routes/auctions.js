const express = require('express');
const multer = require('multer');
const path = require('path');
const Auction = require('../models/auction');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find().select('-bids');
    const auctionsWithoutBids = auctions.map(auction => {
      const { bids, ...auctionWithoutBids } = auction.toObject();
      return auctionWithoutBids;
    });
    res.json(auctionsWithoutBids);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Error fetching auctions' });
  }
});


router.get('/my-auctions', auth, async (req, res) => {
  try {
    const auctions = await Auction.find({ creator: req.userId });
    const auctionsWithCurrentBid = auctions.map(auction => {
      const highestBid = auction.bids && auction.bids.length > 0 
        ? Math.max(...auction.bids.map(bid => bid.amount))
        : auction.startingBid;
      return {
        ...auction.toObject(),
        currentBid: highestBid,
        bids: undefined 
      };
    });
    res.json(auctionsWithCurrentBid);
  } catch (error) {
    console.error('Error fetching user auctions:', error);
    res.status(500).json({ message: 'Error fetching user auctions' });
  }
});


router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, type, startingBid, minimumBid, duration, email } = req.body;
    
    
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const endTime = new Date(Date.now() + durationMs);

    const auction = new Auction({
      title,
      description,
      type,
      startingBid: parseFloat(startingBid),
      minimumBid: parseFloat(minimumBid),
      duration,
      endTime,
      email,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      creator: req.userId,
    });
    auction.generateRSAKeys();
    await auction.save();

    // Set up automatic closing
    setTimeout(async () => {
      auction.status = 'closed';
      await auction.save();
      console.log(`Auction ${auction._id} closed automatically`);
    }, durationMs);

    res.status(201).json(auction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Error creating auction' });
  }
});

// Place bid on auction
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (auction.status === 'closed') {
      return res.status(400).json({ message: 'This auction is closed' });
    }

    const existingBid = auction.bids.find(bid => bid.bidder.toString() === req.userId);
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this auction' });
    }

    const encryptedAmount = auction.encryptBid(amount);
    auction.bids.push({ bidder: req.userId, encryptedAmount });
    await auction.save();

    res.json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Error placing bid' });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    const isCreator = auction.creator.toString() === req.userId;
    const auctionObj = auction.toObject();

    if (auction.status === 'closed') {
      if (isCreator) {
        auctionObj.bids = await Promise.all(auctionObj.bids.map(async (bid) => {
          const bidder = await User.findById(bid.bidder);
          return {
            ...bid,
            amount: auction.decryptBid(bid.encryptedAmount),
            bidderUsername: bidder.username
          };
        }));
        const maxBid = Math.max(...auctionObj.bids.map(bid => bid.amount));
        auctionObj.maxBid = maxBid;
        auctionObj.winningBidder = auctionObj.bids.find(bid => bid.amount === maxBid).bidderUsername;
      } else {
        const maxBid = Math.max(...auction.bids.map(bid => auction.decryptBid(bid.encryptedAmount)));
        auctionObj.maxBid = maxBid;
        const winningBid = auction.bids.find(bid => auction.decryptBid(bid.encryptedAmount) === maxBid);
        const winningBidder = await User.findById(winningBid.bidder);
        auctionObj.winningBidder = winningBidder.username;
        delete auctionObj.bids;
      }
    } else {
      delete auctionObj.bids;
    }

    res.json(auctionObj);
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ message: 'Error fetching auction' });
  }
});

module.exports = router;
