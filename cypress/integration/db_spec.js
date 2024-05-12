const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

it('can insert a document into collection', async () => {
    const Users = mongoose.model('Users', new mongoose.Schema({ name: String }));
    const user = new Users({ name: 'John Doe' });
    await user.save();

    const fetchedUser = await Users.findOne();
    expect(fetchedUser.name).toEqual('John Doe');
});
