import { connectToDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';

export async function getEvents(req, res) {
  try {
    const userId = req.userId;
    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const events = await eventsCollection
      .find({ userId: new ObjectId(userId) })
      .toArray();

    return res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createEvent(req, res) {
  try {
    const userId = req.userId;
    const { title, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const result = await eventsCollection.insertOne({
      userId: new ObjectId(userId),
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'BUSY',
      createdAt: new Date(),
    });

    return res.status(201).json({
      id: result.insertedId.toString(),
      userId,
      title,
      startTime,
      endTime,
      status: 'BUSY',
    });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateEvent(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status' });
    }

    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getSwappableSlots(req, res) {
  try {
    const userId = req.userId;
    const { db } = await connectToDatabase();
    const eventsCollection = db.collection('events');
    const usersCollection = db.collection('users');

    const events = await eventsCollection
      .find({
        status: 'SWAPPABLE',
        userId: { $ne: new ObjectId(userId) },
      })
      .toArray();

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const user = await usersCollection.findOne({ _id: event.userId });
        return {
          ...event,
          owner: {
            name: user?.name || 'Unknown',
            email: user?.email || 'Unknown',
          },
        };
      })
    );

    return res.json(enrichedEvents);
  } catch (error) {
    console.error('Get swappable slots error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
