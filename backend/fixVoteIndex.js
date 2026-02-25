const mongoose = require('mongoose');
require('dotenv').config();

const fixVoteIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const votesCollection = db.collection('votes');

    // Drop the old index
    try {
      await votesCollection.dropIndex('userId_1_targetId_1');
      console.log('Dropped old index: userId_1_targetId_1');
    } catch (error) {
      console.log('Old index not found or already dropped');
    }

    // Create new index
    await votesCollection.createIndex(
      { userId: 1, targetId: 1, targetType: 1 },
      { unique: true }
    );
    console.log('Created new index: userId_1_targetId_1_targetType_1');

    console.log('Vote index fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing vote index:', error);
    process.exit(1);
  }
};

fixVoteIndex();
