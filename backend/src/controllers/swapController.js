import { connectToDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';

export async function createSwapRequest(req, res) {
  try {
    const userId = req.userId;
    const { mySlotId, theirSlotId } = req.body;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ error: 'Missing slot IDs' });
    }

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');
    const swapRequestsCollection = db.collection('swapRequests');

    // Verify that my slot belongs to me and is swappable
    const mySlot = await eventsCollection.findOne({
      _id: new ObjectId(mySlotId),
      userId: new ObjectId(userId),
      status: 'SWAPPABLE',
    });

    // Verify that their slot exists and is swappable
    const theirSlot = await eventsCollection.findOne({
      _id: new ObjectId(theirSlotId),
      status: 'SWAPPABLE',
    });

    if (!mySlot || !theirSlot) {
      return res.status(400).json({ error: 'One or both slots are not available' });
    }

    // Create the swap request
    const result = await swapRequestsCollection.insertOne({
      requesterUserId: new ObjectId(userId),
      requesterSlotId: new ObjectId(mySlotId),
      targetUserId: theirSlot.userId,
      targetSlotId: new ObjectId(theirSlotId),
      status: 'PENDING',
      createdAt: new Date(),
    });

    // Mark both slots as pending to prevent them from being used in other swaps
    await eventsCollection.updateMany(
      {
        _id: {
          $in: [new ObjectId(mySlotId), new ObjectId(theirSlotId)],
        },
      },
      { $set: { status: 'SWAP_PENDING' } }
    );

    return res.status(201).json({
      id: result.insertedId.toString(),
      status: 'PENDING',
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getSwapRequests(req, res) {
  try {
    const userId = req.userId;
    const { db } = await connectToDatabase();
    const swapRequestsCollection = db.collection('swapRequests');
    const eventsCollection = db.collection('events');
    const usersCollection = db.collection('users');

    const requests = await swapRequestsCollection
      .find({
        $or: [
          { requesterUserId: new ObjectId(userId) },
          { targetUserId: new ObjectId(userId) },
        ],
      })
      .toArray();

    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const [requester, target, mySlot, theirSlot] = await Promise.all([
          usersCollection.findOne({ _id: request.requesterUserId }),
          usersCollection.findOne({ _id: request.targetUserId }),
          eventsCollection.findOne({ _id: request.requesterSlotId }),
          eventsCollection.findOne({ _id: request.targetSlotId }),
        ]);

        return {
          ...request,
          requester: { name: requester?.name, email: requester?.email },
          target: { name: target?.name, email: target?.email },
          mySlot,
          theirSlot,
        };
      })
    );

    return res.json(enrichedRequests);
  } catch (error) {
    console.error('Get swap requests error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function respondToSwapRequest(req, res) {
  try {
    const userId = req.userId;
    const { requestId } = req.params;
    const { response } = req.body;

    // Validate response value
    if (!response || !['ACCEPTED', 'REJECTED'].includes(response)) {
      return res.status(400).json({ error: 'Invalid response' });
    }

    const { db } = await connectToDatabase();
    const swapRequestsCollection = db.collection('swapRequests');
    const eventsCollection = db.collection('events');

    // Verify that this swap request exists and is for the current user
    const swapRequest = await swapRequestsCollection.findOne({
      _id: new ObjectId(requestId),
      targetUserId: new ObjectId(userId),
    });

    if (!swapRequest) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    // Update the swap request status
    await swapRequestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: response } }
    );

    if (response === 'ACCEPTED') {
      // If accepted, mark both events as BUSY (swap completed)
      // In a real app, you might also swap the ownership here
      await eventsCollection.updateMany(
        {
          _id: {
            $in: [swapRequest.requesterSlotId, swapRequest.targetSlotId],
          },
        },
        { $set: { status: 'BUSY' } }
      );
    } else {
      // If rejected, make both slots swappable again
      await eventsCollection.updateMany(
        {
          _id: {
            $in: [swapRequest.requesterSlotId, swapRequest.targetSlotId],
          },
        },
        { $set: { status: 'SWAPPABLE' } }
      );
    }

    return res.json({ message: 'Swap request updated successfully' });
  } catch (error) {
    console.error('Respond to swap request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
